import { NextResponse } from "next/server";

type ChallengeLanguage = "SQL" | "Python";
type LoadRequest = { repository?: string; branch?: string; path?: string; token?: string };

function cleanPath(value: string) {
  return value.split("/").filter((part) => part && part !== "." && part !== "..").join("/");
}

function encodePath(value: string) {
  return value.split("/").map(encodeURIComponent).join("/");
}

function decodeBase64(value: string) {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parseMarkdown(markdown: string, filePath: string) {
  const filename = filePath.split("/").at(-1) || "";
  const directory = filePath.includes("/") ? filePath.split("/").slice(0, -1).join("/") : "";
  const heading = markdown.match(/^#\s+(?:DataLemur\s+)?Challenge\s+([^:\n]+):\s*(.+)$/m);
  const filenameParts = filename.replace(/\.md$/i, "").split("_");
  const challengeNumber = heading?.[1]?.trim() || filenameParts.shift() || "";
  const title = heading?.[2]?.trim() || filenameParts.join(" ");
  const source = markdown.match(/\*\*Source:\*\*\s*\[View challenge\]\((https:\/\/[^)]+)\)/i)?.[1] || "";
  const challengeHeading = markdown.match(/^##\s+Challenge\s*$/m);
  const challengeStart = challengeHeading?.index ?? -1;
  const challengeBodyStart = challengeStart >= 0 ? challengeStart + (challengeHeading?.[0].length || 0) : -1;
  const firstSolution = markdown.search(/^##\s+(?:SQL|Python)\s+Solution(?:\s+#\d+)?\s*$/m);
  const question = challengeBodyStart >= 0 && firstSolution > challengeBodyStart
    ? markdown.slice(challengeBodyStart, firstSolution).trim()
    : "";

  const headings = [...markdown.matchAll(/^##\s+(SQL|Python)\s+Solution(?:\s+#(\d+))?\s*$/gm)];
  const solutions = headings.map((match, index) => {
    const language = match[1] as ChallengeLanguage;
    const start = (match.index || 0) + match[0].length;
    const end = headings[index + 1]?.index ?? markdown.length;
    const section = markdown.slice(start, end);
    const fenced = section.match(/(?:~~~|```)(?:sql|python)?\s*\n([\s\S]*?)\n(?:~~~|```)/i);
    const metadata = section.match(/_(?:Dialect|Runtime):\s*([^_\n]+)_/i)?.[1]?.trim();
    return { id: index + 1, language, runtime: metadata || (language === "Python" ? "Python 3" : "MySQL"), code: fenced?.[1]?.trim() || "" };
  });

  if (!solutions.length) throw new Error("No SQL or Python solution section was found in this Markdown file.");
  return {
    filename,
    directory,
    provider: source.includes("datalemur.com") || directory.includes("DataLemur") ? "DataLemur" : source.includes("hackerrank.com") || directory.includes("HackerRank") ? "HackerRank" : "",
    challengeNumber,
    title,
    challengeUrl: source,
    question,
    solutions,
  };
}

export async function POST(request: Request) {
  let body: LoadRequest;
  try { body = (await request.json()) as LoadRequest; } catch { return NextResponse.json({ message: "The request was not valid JSON." }, { status: 400 }); }

  const repository = body.repository?.trim() || "";
  const branch = body.branch?.trim() || "main";
  const filePath = cleanPath(body.path?.trim() || "");
  const token = body.token?.trim() || "";
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) return NextResponse.json({ message: "Use the repository format username/repository." }, { status: 400 });
  if (!filePath.endsWith(".md") || !token) return NextResponse.json({ message: "An existing Markdown path and GitHub token are required." }, { status: 400 });

  const endpoint = `https://api.github.com/repos/${repository}/contents/${encodePath(filePath)}?ref=${encodeURIComponent(branch)}`;
  let response: Response;
  try {
    response = await fetch(endpoint, { headers: { accept: "application/vnd.github+json", authorization: `Bearer ${token}`, "x-github-api-version": "2022-11-28", "user-agent": "challenge-notebook-publisher" }, signal: AbortSignal.timeout(12_000) });
  } catch {
    return NextResponse.json({ message: "GitHub did not respond. Try again shortly." }, { status: 502 });
  }
  const result = (await response.json().catch(() => ({}))) as { message?: string; type?: string; content?: string };
  if (!response.ok) return NextResponse.json({ message: result.message || "GitHub could not load that file." }, { status: response.status });
  if (result.type !== "file" || !result.content) return NextResponse.json({ message: "That GitHub path is not a Markdown file." }, { status: 400 });

  try { return NextResponse.json(parseMarkdown(decodeBase64(result.content), filePath)); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "The Markdown format could not be read." }, { status: 422 }); }
}

import { NextResponse } from "next/server";

type ChallengeUrl =
  | { provider: "HackerRank"; contest: string; slug: string }
  | { provider: "DataLemur"; slug: string }
  | { provider: "LeetCode"; slug: string };

type ChallengeLanguage = "SQL" | "Python";

type HackerRankChallenge = {
  id?: number | string;
  name?: string;
  problem_statement?: string;
  input_format?: string;
  constraints?: string;
  output_format?: string;
  difficulty_name?: string;
};

type DataLemurChallenge = {
  id?: number | string;
  slug?: string;
  title?: string;
  description?: string;
  difficulty?: string;
  category?: string;
  defaultRuntime?: string;
  accessGroups?: unknown[] | null;
  isGuarded?: boolean;
};

type LeetCodeChallenge = {
  questionFrontendId?: string;
  title?: string;
  content?: string;
  difficulty?: string;
  isPaidOnly?: boolean;
};

function meaningful(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function decodeHtmlEntities(value: string) {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    ldquo: "“",
    lsquo: "‘",
    lt: "<",
    mdash: "—",
    nbsp: " ",
    ndash: "–",
    quot: '"',
    rdquo: "”",
    rsquo: "’",
  };

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] === "#") {
      const hexadecimal = code[1]?.toLowerCase() === "x";
      const point = Number.parseInt(code.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
    }
    return named[code.toLowerCase()] ?? entity;
  });
}

function htmlToMarkdown(html: string) {
  const codeBlocks: string[] = [];
  const inlineCode: string[] = [];
  const withPlaceholders = html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_match, contents: string) => {
      const text = decodeHtmlEntities(contents.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).trim();
      const index = codeBlocks.push(`\n\n~~~text\n${text}\n~~~\n\n`) - 1;
      return `LEETCODECODEBLOCK${index}END`;
    })
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_match, contents: string) => {
      const text = decodeHtmlEntities(contents.replace(/<[^>]+>/g, "")).trim();
      const index = inlineCode.push(`\`${text.replace(/`/g, "\\`")}\``) - 1;
      return `LEETCODEINLINECODE${index}END`;
    });

  return decodeHtmlEntities(withPlaceholders
    .replace(/<h([1-6])[^>]*>/gi, (_match, level: string) => `\n\n${"#".repeat(Number(level) + 2)} `)
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<(strong|b)[^>]*>/gi, "**")
    .replace(/<\/(strong|b)>/gi, "**")
    .replace(/<(em|i)[^>]*>/gi, "*")
    .replace(/<\/(em|i)>/gi, "*")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/li>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|ul|ol|table|tr)>/gi, "\n\n")
    .replace(/<[^>]+>/g, ""))
    .replace(/LEETCODECODEBLOCK(\d+)END/g, (_match, index: string) => codeBlocks[Number(index)] || "")
    .replace(/LEETCODEINLINECODE(\d+)END/g, (_match, index: string) => inlineCode[Number(index)] || "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseChallengeUrl(rawUrl: string): ChallengeUrl {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Paste a complete HackerRank, DataLemur, or LeetCode question URL.");
  }

  if (url.protocol !== "https:") {
    throw new Error("Challenge links must use HTTPS.");
  }

  const hostname = url.hostname.toLowerCase();
  const segments = url.pathname.split("/").filter(Boolean);

  if (["hackerrank.com", "www.hackerrank.com"].includes(hostname)) {
    if (segments[0] === "challenges" && segments[1]) {
      return { provider: "HackerRank", contest: "master", slug: segments[1] };
    }
    if (segments[0] === "contests" && segments[1] && segments[2] === "challenges" && segments[3]) {
      return { provider: "HackerRank", contest: segments[1], slug: segments[3] };
    }
    throw new Error("This does not look like a HackerRank challenge problem link.");
  }

  if (["datalemur.com", "www.datalemur.com"].includes(hostname)) {
    if (segments[0] === "questions" && segments[1]) {
      return { provider: "DataLemur", slug: segments[1] };
    }
    throw new Error("Paste an individual DataLemur question link, not the questions catalog.");
  }

  if (["leetcode.com", "www.leetcode.com"].includes(hostname)) {
    if (segments[0] === "problems" && segments[1]) {
      return { provider: "LeetCode", slug: segments[1] };
    }
    throw new Error("Paste an individual LeetCode problem link, not the problem catalog.");
  }

  throw new Error("Only public HackerRank, DataLemur, and LeetCode question links are supported.");
}

async function importHackerRank(challenge: Extract<ChallengeUrl, { provider: "HackerRank" }>, language: ChallengeLanguage) {
  const endpoint = `https://www.hackerrank.com/rest/contests/${encodeURIComponent(challenge.contest)}/challenges/${encodeURIComponent(challenge.slug)}`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: { accept: "application/json", "user-agent": "sql-challenge-publisher/1.0" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new Error("HackerRank did not respond. Try again shortly.");
  }

  if (!response.ok) {
    throw new Error(response.status === 404 ? "That public HackerRank challenge was not found." : "HackerRank could not provide this challenge.");
  }

  const payload = (await response.json().catch(() => null)) as { status?: boolean; model?: HackerRankChallenge } | null;
  const model = payload?.model;
  if (!payload?.status || !model || !meaningful(model.name) || !meaningful(model.problem_statement)) {
    throw new Error("HackerRank returned an incomplete challenge.");
  }

  const sections = [model.problem_statement.trim()];
  if (meaningful(model.input_format)) sections.push(`### Input Format\n\n${model.input_format.trim()}`);
  if (meaningful(model.constraints)) sections.push(`### Constraints\n\n${model.constraints.trim()}`);
  if (meaningful(model.output_format)) sections.push(`### Output Format\n\n${model.output_format.trim()}`);

  return {
    provider: "HackerRank" as const,
    challengeNumber: model.id === undefined || model.id === null ? null : String(model.id),
    title: model.name.trim(),
    question: sections.join("\n\n"),
    difficulty: meaningful(model.difficulty_name) ? model.difficulty_name.trim() : null,
    runtime: language === "Python" ? "Python 3" : null,
  };
}

function extractDataLemurChallenge(html: string): DataLemurChallenge | null {
  const match = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return null;

  const payload = JSON.parse(match[1]) as {
    props?: { pageProps?: { dehydratedState?: { queries?: Array<{ state?: { data?: unknown } }> } } };
  };
  const queries = payload.props?.pageProps?.dehydratedState?.queries ?? [];
  for (const query of queries) {
    const data = query.state?.data;
    if (data && typeof data === "object" && meaningful((data as DataLemurChallenge).title)) {
      return data as DataLemurChallenge;
    }
  }
  return null;
}

async function importDataLemur(challenge: Extract<ChallengeUrl, { provider: "DataLemur" }>, language: ChallengeLanguage) {
  const endpoint = `https://datalemur.com/questions/${encodeURIComponent(challenge.slug)}`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: { accept: "text/html", "user-agent": "sql-challenge-publisher/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });
  } catch {
    throw new Error("DataLemur did not respond. Try again shortly.");
  }

  if (!response.ok) {
    throw new Error(response.status === 404 ? "That DataLemur question was not found." : "DataLemur could not provide this question.");
  }

  let model: DataLemurChallenge | null = null;
  try {
    model = extractDataLemurChallenge(await response.text());
  } catch {
    throw new Error("DataLemur returned an unreadable question.");
  }

  if (!model || !meaningful(model.title)) {
    throw new Error("DataLemur returned an incomplete question.");
  }
  if (model.isGuarded || (Array.isArray(model.accessGroups) && model.accessGroups.length > 0) || !meaningful(model.description)) {
    throw new Error("This DataLemur question is premium or not publicly available. Paste the question manually instead.");
  }
  const category = meaningful(model.category) ? model.category.trim().toUpperCase() : "";
  if (category && category !== language.toUpperCase()) {
    throw new Error(`This is a DataLemur ${model.category} question. Switch the publisher to ${model.category} and import it again.`);
  }

  return {
    provider: "DataLemur" as const,
    challengeNumber: model.id === undefined || model.id === null ? challenge.slug : String(model.id),
    title: model.title.trim(),
    question: model.description.trim(),
    difficulty: meaningful(model.difficulty) ? model.difficulty.trim() : null,
    runtime: language === "Python" ? "Python 3" : "MySQL",
  };
}

async function importLeetCode(challenge: Extract<ChallengeUrl, { provider: "LeetCode" }>, language: ChallengeLanguage) {
  const endpoint = "https://leetcode.com/graphql/";
  const query = `query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionFrontendId
      title
      content
      difficulty
      isPaidOnly
    }
  }`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        referer: `https://leetcode.com/problems/${encodeURIComponent(challenge.slug)}/`,
        "user-agent": "coding-challenge-publisher/1.0",
      },
      body: JSON.stringify({ query, variables: { titleSlug: challenge.slug } }),
      signal: AbortSignal.timeout(12_000),
    });
  } catch {
    throw new Error("LeetCode did not respond. Try again shortly.");
  }

  if (!response.ok) {
    throw new Error(response.status === 404 ? "That public LeetCode problem was not found." : "LeetCode could not provide this problem.");
  }

  const payload = (await response.json().catch(() => null)) as { data?: { question?: LeetCodeChallenge | null }; errors?: unknown[] } | null;
  const model = payload?.data?.question;
  if (!model || !meaningful(model.title)) {
    throw new Error("LeetCode returned an incomplete problem.");
  }
  if (model.isPaidOnly || !meaningful(model.content)) {
    throw new Error("This LeetCode problem requires account or subscription access. Paste the question manually instead.");
  }

  const question = htmlToMarkdown(model.content);
  if (!question) {
    throw new Error("LeetCode returned an unreadable problem statement.");
  }

  return {
    provider: "LeetCode" as const,
    challengeNumber: meaningful(model.questionFrontendId) ? model.questionFrontendId.trim() : challenge.slug,
    title: model.title.trim(),
    question,
    difficulty: meaningful(model.difficulty) ? model.difficulty.trim() : null,
    runtime: language === "Python" ? "Python 3" : "MySQL",
  };
}

export async function POST(request: Request) {
  let rawUrl = "";
  let language: ChallengeLanguage = "SQL";
  try {
    const body = (await request.json()) as { url?: unknown; language?: unknown };
    rawUrl = typeof body.url === "string" ? body.url.trim() : "";
    language = body.language === "Python" ? "Python" : "SQL";
  } catch {
    return NextResponse.json({ message: "The request was not valid JSON." }, { status: 400 });
  }

  let challenge: ChallengeUrl;
  try {
    challenge = parseChallengeUrl(rawUrl);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Invalid challenge URL." }, { status: 400 });
  }

  try {
    const result = challenge.provider === "HackerRank"
      ? await importHackerRank(challenge, language)
      : challenge.provider === "DataLemur"
        ? await importDataLemur(challenge, language)
        : await importLeetCode(challenge, language);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The challenge could not be imported.";
    const isRestricted = message.includes("premium") || message.includes("not publicly available") || message.includes("subscription access");
    return NextResponse.json({ message }, { status: isRestricted ? 403 : 502 });
  }
}

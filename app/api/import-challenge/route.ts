import { NextResponse } from "next/server";

type ChallengeUrl =
  | { provider: "HackerRank"; contest: string; slug: string }
  | { provider: "DataLemur"; slug: string };

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

function meaningful(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseChallengeUrl(rawUrl: string): ChallengeUrl {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Paste a complete HackerRank or DataLemur question URL.");
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

  throw new Error("Only public HackerRank and DataLemur question links are supported.");
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
    const result = challenge.provider === "HackerRank" ? await importHackerRank(challenge, language) : await importDataLemur(challenge, language);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The challenge could not be imported.";
    const isRestricted = message.includes("premium") || message.includes("not publicly available");
    return NextResponse.json({ message }, { status: isRestricted ? 403 : 502 });
  }
}

import type { NextResponse } from "next/server";

const MCP_URL = "https://api.stratascratch.com/mcp";
const TOKEN_URL = "https://api.stratascratch.com/o/token/";
const SESSION_COOKIE = "stratascratch_session";
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export type StrataScratchSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
};

type McpTool = {
  name?: string;
  inputSchema?: {
    properties?: Record<string, { type?: string }>;
    required?: string[];
  };
};

type JsonRpcResponse = {
  error?: { code?: number; message?: string };
  result?: Record<string, unknown>;
};

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function cookieKey() {
  const secret = process.env.STRATASCRATCH_COOKIE_SECRET;
  if (!secret) throw new Error("StrataScratch integration is not configured.");
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function sealCookie(value: unknown) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await cookieKey(),
    textEncoder.encode(JSON.stringify(value)),
  );
  return `${base64UrlEncode(iv)}.${base64UrlEncode(new Uint8Array(encrypted))}`;
}

export async function unsealCookie<T>(value?: string): Promise<T | null> {
  if (!value) return null;
  try {
    const [encodedIv, encodedPayload] = value.split(".");
    if (!encodedIv || !encodedPayload) return null;
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64UrlDecode(encodedIv) },
      await cookieKey(),
      base64UrlDecode(encodedPayload),
    );
    return JSON.parse(textDecoder.decode(decrypted)) as T;
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, value: string) {
  response.cookies.set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function sessionCookieName() {
  return SESSION_COOKIE;
}

function oauthClientId() {
  const clientId = process.env.STRATASCRATCH_CLIENT_ID;
  if (!clientId) throw new Error("StrataScratch OAuth is not configured.");
  return clientId;
}

export function oauthRedirectUri() {
  return process.env.STRATASCRATCH_REDIRECT_URI || "https://challenge-publisher.das-reemika.chatgpt.site/api/stratascratch/callback";
}

async function refreshSession(session: StrataScratchSession) {
  if (session.expiresAt > Date.now() + 60_000) return { session, refreshed: false };
  if (!session.refreshToken) throw new Error("Your StrataScratch connection expired. Connect it again.");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: session.refreshToken,
    client_id: oauthClientId(),
    resource: MCP_URL,
  });
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(12_000),
  });
  const payload = await response.json().catch(() => null) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  } | null;
  if (!response.ok || !payload?.access_token) throw new Error("Your StrataScratch connection expired. Connect it again.");
  return {
    refreshed: true,
    session: {
      accessToken: payload.access_token,
      refreshToken: payload.refresh_token || session.refreshToken,
      expiresAt: Date.now() + Math.max(60, payload.expires_in || 3600) * 1000,
    },
  };
}

function parseEventStream(text: string): JsonRpcResponse {
  const messages = text
    .split(/\r?\n\r?\n/)
    .flatMap((event) => event.split(/\r?\n/).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()))
    .filter(Boolean);
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    try {
      return JSON.parse(messages[index]) as JsonRpcResponse;
    } catch {
      // Ignore keep-alives and continue to the previous data event.
    }
  }
  throw new Error("StrataScratch returned an unreadable MCP response.");
}

async function readMcpResponse(response: Response) {
  const text = await response.text();
  if (!response.ok) {
    if (response.status === 401) throw new Error("Your StrataScratch connection expired. Connect it again.");
    throw new Error(`StrataScratch MCP request failed (${response.status}).`);
  }
  if (!text.trim()) return {} as JsonRpcResponse;
  const payload = response.headers.get("content-type")?.includes("text/event-stream")
    ? parseEventStream(text)
    : JSON.parse(text) as JsonRpcResponse;
  if (payload.error) throw new Error(payload.error.message || "StrataScratch MCP returned an error.");
  return payload;
}

async function mcpPost(accessToken: string, payload: Record<string, unknown>, sessionId?: string) {
  const response = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
      ...(sessionId ? { "mcp-session-id": sessionId } : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });
  return {
    payload: await readMcpResponse(response),
    sessionId: response.headers.get("mcp-session-id") || sessionId,
  };
}

async function openMcpSession(accessToken: string) {
  const initialized = await mcpPost(accessToken, {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "coding-challenge-publisher", version: "1.0.0" },
    },
  });
  await mcpPost(accessToken, {
    jsonrpc: "2.0",
    method: "notifications/initialized",
    params: {},
  }, initialized.sessionId);
  return initialized.sessionId;
}

function questionArguments(tool: McpTool, questionId: string, slug: string) {
  const properties = tool.inputSchema?.properties || {};
  const required = tool.inputSchema?.required || [];
  const args: Record<string, unknown> = {};
  for (const [name, schema] of Object.entries(properties)) {
    const normalized = name.replace(/[^a-z0-9]/gi, "").toLowerCase();
    if (["id", "questionid", "codingquestionid", "problemid"].includes(normalized)) {
      args[name] = schema.type === "integer" || schema.type === "number" ? Number(questionId) : questionId;
    } else if (["slug", "questionslug", "problemslug"].includes(normalized)) {
      args[name] = slug;
    }
  }
  const missing = required.filter((name) => args[name] === undefined);
  if (missing.length) throw new Error(`StrataScratch's question tool requires unsupported fields: ${missing.join(", ")}.`);
  return args;
}

function firstString(record: Record<string, unknown>, names: string[]) {
  for (const name of names) {
    const value = record[name];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function findQuestionRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = findQuestionRecord(item);
      if (match) return match;
    }
    return null;
  }
  const record = value as Record<string, unknown>;
  const title = firstString(record, ["title", "name", "question_title", "questionTitle"]);
  const prompt = firstString(record, ["prompt", "description", "question", "question_text", "questionText", "body"]);
  if (title && prompt) return record;
  for (const child of Object.values(record)) {
    const match = findQuestionRecord(child);
    if (match) return match;
  }
  return null;
}

function contentPayload(result: Record<string, unknown>) {
  const structured = result.structuredContent;
  if (structured && typeof structured === "object") return structured;
  const content = result.content;
  if (Array.isArray(content)) {
    for (const item of content) {
      if (!item || typeof item !== "object") continue;
      const text = (item as Record<string, unknown>).text;
      if (typeof text !== "string" || !text.trim()) continue;
      try {
        return JSON.parse(text) as unknown;
      } catch {
        return { title: "StrataScratch challenge", prompt: text };
      }
    }
  }
  return result;
}

function plainText(value: string) {
  if (!/<[a-z][\s\S]*>/i.test(value)) return value.trim();
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function importStrataScratchQuestion(
  encryptedSession: string,
  questionId: string,
  slug: string,
  language: "SQL" | "Python",
) {
  const existing = await unsealCookie<StrataScratchSession>(encryptedSession);
  if (!existing) throw new Error("Connect your StrataScratch account to import this challenge.");
  const { session, refreshed } = await refreshSession(existing);
  const sessionId = await openMcpSession(session.accessToken);
  const toolsResponse = await mcpPost(session.accessToken, {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {},
  }, sessionId);
  const tools = Array.isArray(toolsResponse.payload.result?.tools) ? toolsResponse.payload.result.tools as McpTool[] : [];
  const getQuestion = tools.find((tool) => tool.name === "get_question");
  if (!getQuestion) throw new Error("StrataScratch did not expose its question import tool.");

  const questionResponse = await mcpPost(session.accessToken, {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: { name: "get_question", arguments: questionArguments(getQuestion, questionId, slug) },
  }, sessionId);
  const result = questionResponse.payload.result || {};
  if (result.isError === true) throw new Error("StrataScratch could not provide this question for the connected account.");
  const question = findQuestionRecord(contentPayload(result));
  if (!question) throw new Error("StrataScratch returned an incomplete question.");

  const title = firstString(question, ["title", "name", "question_title", "questionTitle"]);
  const prompt = firstString(question, ["prompt", "description", "question", "question_text", "questionText", "body"]);
  const difficulty = firstString(question, ["difficulty", "difficulty_level", "difficultyLevel"]);
  return {
    challenge: {
      provider: "StrataScratch" as const,
      challengeNumber: firstString(question, ["id", "question_id", "questionId"]) || questionId,
      title,
      question: plainText(prompt),
      difficulty: difficulty || null,
      runtime: language === "Python" ? "Python 3" : "PostgreSQL",
    },
    encryptedSession: refreshed ? await sealCookie(session) : null,
  };
}

export async function exchangeAuthorizationCode(code: string, verifier: string) {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: oauthRedirectUri(),
      client_id: oauthClientId(),
      code_verifier: verifier,
      resource: MCP_URL,
    }),
    signal: AbortSignal.timeout(12_000),
  });
  const payload = await response.json().catch(() => null) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  } | null;
  if (!response.ok || !payload?.access_token) throw new Error("StrataScratch authorization could not be completed.");
  return sealCookie({
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAt: Date.now() + Math.max(60, payload.expires_in || 3600) * 1000,
  } satisfies StrataScratchSession);
}

export function authorizationUrl(state: string, challenge: string) {
  const url = new URL("https://api.stratascratch.com/o/authorize/");
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: oauthClientId(),
    redirect_uri: oauthRedirectUri(),
    scope: "mcp:read",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    resource: MCP_URL,
  }).toString();
  return url;
}

export function randomUrlSafe(bytes = 32) {
  return base64UrlEncode(crypto.getRandomValues(new Uint8Array(bytes)));
}

export async function pkceChallenge(verifier: string) {
  return base64UrlEncode(new Uint8Array(await crypto.subtle.digest("SHA-256", textEncoder.encode(verifier))));
}

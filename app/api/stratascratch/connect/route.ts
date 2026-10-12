import { NextResponse } from "next/server";
import { authorizationUrl, pkceChallenge, randomUrlSafe, sealCookie } from "@/lib/stratascratch";

const OAUTH_COOKIE = "stratascratch_oauth";

export async function GET() {
  try {
    const state = randomUrlSafe();
    const verifier = randomUrlSafe(64);
    const response = NextResponse.redirect(authorizationUrl(state, await pkceChallenge(verifier)));
    response.headers.set("cache-control", "private, no-store");
    response.cookies.set(OAUTH_COOKIE, await sealCookie({ state, verifier }), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });
    return response;
  } catch {
    return NextResponse.redirect(new URL("/?stratascratch=configuration-error", "https://challenge-publisher.das-reemika.chatgpt.site"));
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { exchangeAuthorizationCode, sessionCookieName, setSessionCookie, unsealCookie } from "@/lib/stratascratch";

const OAUTH_COOKIE = "stratascratch_oauth";

type OAuthState = { state: string; verifier: string };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const cookieStore = await cookies();
  const oauth = await unsealCookie<OAuthState>(cookieStore.get(OAUTH_COOKIE)?.value);
  const destination = new URL("/", request.url);

  if (error || !code || !returnedState || !oauth || returnedState !== oauth.state) {
    destination.searchParams.set("stratascratch", error === "access_denied" ? "cancelled" : "error");
    const response = NextResponse.redirect(destination);
    response.headers.set("cache-control", "private, no-store");
    response.cookies.delete(OAUTH_COOKIE);
    return response;
  }

  try {
    const session = await exchangeAuthorizationCode(code, oauth.verifier);
    destination.searchParams.set("stratascratch", "connected");
    const response = NextResponse.redirect(destination);
    response.headers.set("cache-control", "private, no-store");
    setSessionCookie(response, session);
    response.cookies.delete(OAUTH_COOKIE);
    return response;
  } catch {
    destination.searchParams.set("stratascratch", "error");
    const response = NextResponse.redirect(destination);
    response.headers.set("cache-control", "private, no-store");
    response.cookies.delete(OAUTH_COOKIE);
    response.cookies.delete(sessionCookieName());
    return response;
  }
}

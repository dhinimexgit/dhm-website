import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAMES,
  getAdminSessionCookieOptions,
  hasValidAdminSession,
  parseLastActivityMs,
} from "@/lib/admin-session";

const LOGIN_PATH = "/dhm-myadmin/login";

function clearAdminSession(response: NextResponse) {
  for (const name of ADMIN_SESSION_COOKIE_NAMES) {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  }
}

function touchAdminSession(response: NextResponse) {
  const opts = getAdminSessionCookieOptions();
  response.cookies.set("dhm_admin_last_activity", String(Date.now()), opts);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("dhm_admin_session")?.value;
  const user = request.cookies.get("dhm_admin_user")?.value;
  const lastActivity = request.cookies.get("dhm_admin_last_activity")?.value;

  const isLoginRoute =
    pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);

  const valid = hasValidAdminSession(session, user, lastActivity);

  if (isLoginRoute) {
    if (valid) {
      return NextResponse.redirect(new URL("/dhm-myadmin", request.url));
    }
    if (session || user) {
      const response = NextResponse.next();
      clearAdminSession(response);
      return response;
    }
    return NextResponse.next();
  }

  if (!valid) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    if (session || user || parseLastActivityMs(lastActivity) !== null) {
      loginUrl.searchParams.set("expired", "1");
    }
    const response = NextResponse.redirect(loginUrl);
    clearAdminSession(response);
    return response;
  }

  const response = NextResponse.next();
  touchAdminSession(response);
  return response;
}

export const config = {
  matcher: ["/dhm-myadmin/:path*"],
};

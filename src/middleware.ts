import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";
import { isPublicPath } from "@/lib/auth/guards";
import { SESSION_HINT_COOKIE } from "@/lib/auth/session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_HINT_COOKIE);

  if (!isPublicPath(pathname) && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.login;
    url.search = "";
    return NextResponse.redirect(url);
  }
  if (hasSession && (pathname === ROUTES.login || pathname === ROUTES.register || pathname === ROUTES.forgotPassword)) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.dashboard;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.svg).*)"],
};

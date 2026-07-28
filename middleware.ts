import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/photos", request.url));
    }
    return NextResponse.next();
  }

  const isProtectedPage = pathname === "/photos" || pathname.startsWith("/photos/");
  const isProtectedApi =
    pathname.startsWith("/api/photos") ||
    pathname.startsWith("/api/likes") ||
    pathname === "/api/auth/me";

  if ((isProtectedPage || isProtectedApi) && !session) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/photos/:path*",
    "/login",
    "/api/photos/:path*",
    "/api/likes/:path*",
    "/api/auth/me",
  ],
};

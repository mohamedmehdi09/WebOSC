import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "./lib/jwt";
import { redirect } from "next/navigation";
import { STATUS_CODES } from "http";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;

  if (path === "/login" || path == "/signup") {
    if (request.cookies.has("token"))
      return NextResponse.redirect(new URL("/", request.url));
    else return response;
  }

  if (!request.cookies.has("token")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!(await isAuthenticated(request))) {
    response.cookies.delete("token");
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/login", "/signup", "/org/:path*"],
};

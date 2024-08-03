import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "./lib/jwt";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname === "/login") {
    if (request.cookies.has("token"))
      return NextResponse.redirect(new URL("/", request.url));
    else return NextResponse.next();
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
  matcher: ["/", "/login"],
};

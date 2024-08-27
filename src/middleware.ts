import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.cookies.has("token"))
    return NextResponse.redirect(new URL("/", request.url));
  
  else return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/signup"],
};

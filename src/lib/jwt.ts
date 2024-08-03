import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

const secret = process.env.JWT_SECRET || "";

export async function isAuthenticated(request: NextRequest) {
  try {
    const token = request.cookies.get("token");
    if (!token) {
      return false;
    }

    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(secret),
    );

    return true;
  } catch {
    return false;
  }
}

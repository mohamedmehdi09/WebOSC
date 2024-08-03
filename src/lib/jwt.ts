import { jwtVerify } from "jose";
import { SignJWT } from "jose";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function isAuthenticated(request: NextRequest) {
  try {
    const token = request.cookies.get("token");
    if (token == undefined) {
      return false;
    }

    const { payload } = await jwtVerify(token.value, secret);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function signToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("1 day")
    .sign(secret);
  return token;
}

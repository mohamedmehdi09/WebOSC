import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { User } from "@prisma/client";
import { TokenPayload } from "./types";
import { redirect } from "next/navigation";

const secret = process.env.JWT_SECRET;

export async function checkOrgPrivilage(org_id: string) {
  const token = cookies().get("token")?.value;
  if (!token) return false;
  if (!secret) return false;
  let user;
  try {
    user = verify(token, secret) as TokenPayload;
  } catch {
    redirect("/expired");
  }
  if (!user) return false;

  const editor = await prisma.editor.count({
    where: { user_id: user.user_id, org_id: org_id, status: "active" },
  });
  return editor > 0;
}

export function checkSuperUser() {
  const token = cookies().get("token")?.value;
  if (!token) return false;
  if (!secret) return false;

  let user;
  try {
    user = verify(token, secret) as TokenPayload;
  } catch {
    redirect("/expired");
  }
  if (!user) return false;

  return user.super;
}

export function checkEmailValidation() {
  const token = cookies().get("token")?.value;
  if (!token) return false;
  if (!secret) return false;
  let user;
  try {
    user = verify(token, secret) as TokenPayload;
  } catch {
    redirect("/expired");
  }
  if (!user) return false;

  return user.emailVerified;
}

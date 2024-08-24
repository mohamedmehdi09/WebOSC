import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { User } from "@prisma/client";

export async function checkOrgPrivilage(org_id: string) {
  const token = cookies().get("token")?.value;
  if (!token) return false;
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  const user = verify(token, secret) as User;
  if (!user) return false;

  const editor = await prisma.editor.findMany({
    where: { user_id: user.user_id, org_id: org_id, status: "active" },
  });
  return editor.length > 0;
}

export function checkSuperUser() {
  const token = cookies().get("token")?.value;
  if (!token) return false;
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  const user = verify(token, secret) as Omit<User, "password">;
  if (!user) return false;

  return user.super;
}

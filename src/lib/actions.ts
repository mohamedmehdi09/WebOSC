"use server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signToken } from "./jwt";

export async function authenticate(state: any, formData: FormData) {
  let token = "";
  try {
    const email = formData.get("email")?.valueOf();
    const password = formData.get("password")?.valueOf();

    const user = await prisma.user.findFirst({ where: { email: email } });

    if (!user || user?.password !== password)
      return "username or password wrong";

    token = await signToken(user);
  } catch {
    console.log("what happend");
  }
  cookies().set({
    name: "token",
    value: token,
    secure: process.env.NODE_ENV !== "development",
  });
  redirect("/");
}

export async function createUser(state: unknown, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const lastname = formData.get("lastname") as string;
    const isMale = formData.get("isMale") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const user = await prisma.user.create({
      data: {
        name,
        lastname,
        isMale: isMale === "true",
        email,
        password,
      },
    });
    return " hello";
  } catch (error: any) {
    if (error.code === "P2002") {
      return error.message;
    }
    return "errrrr";
  }
}

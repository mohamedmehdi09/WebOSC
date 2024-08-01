"use server";
import { prisma } from "@/lib/prisma";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/react-native.js";

export async function authenticate(state: unknown, formData: FormData) {
  return "username or password wrong!";
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
    if (error.code === 'P2002') {
      return 'email already in use'
    }
    return 'errrrr'
  }
}

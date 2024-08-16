"use server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signToken } from "./jwt";

export async function authenticate(state: string, formData: FormData) {
  let token = "";
  try {
    const email = formData.get("email")?.valueOf();
    const password = formData.get("password")?.valueOf();

    const user = await prisma.user.findFirst({ where: { email: email } });

    if (!user || user?.password !== password)
      return "username or password wrong";

    token = await signToken({
      user_id: user.user_id,
      name: user.name,
      lastname: user.lastname,
      isMale: user.isMale,
      email: user.email,
    });
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

export async function createUser(state: string, formData: FormData) {
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
  } catch (error: any) {
    if (error.code === "P2002") {
      return "email already in use";
    }
    throw Error("faild to create user");
  }
  redirect("/login");
}

export async function CreateOrg(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const nameEn = formData.get("nameEn") as string;
    const nameAr = formData.get("nameAr") as string;
    const parent_org_id = formData.get("parent_org_id") as string;
    const org = await prisma.organization.create({
      data: {
        id,
        nameEn,
        nameAr,
        parent_org_id: parent_org_id === "null" ? null : parent_org_id,
      },
    });
  } catch (error: any) {
    console.log(error);
    throw Error("Error while Creating Org");
  }
  redirect("/org");
}

export async function upadateOrg(formData: FormData) {
  const nameEn = (formData.get("nameEn") as string) || undefined;
  const nameAr = (formData.get("nameAr") as string) || undefined;
  const id = formData.get("id") as string;
  try {
    const org = await prisma.organization.update({
      where: { id: id },
      data: { nameAr: nameAr, nameEn: nameEn },
    });
  } catch (error) {
    console.log("err");
  }
}

export async function addEditorToOrg(formData: FormData) {
  const user_id = formData.get("user_id") as string;
  const org_id = formData.get("org_id") as string;
  console.log(org_id);
  console.log(user_id);
  try {
    const editor = await prisma.editor.create({
      data: { org_id: org_id, user_id: user_id },
    });
  } catch (error) {
    console.log(error);
    return "error occured";
  }
}

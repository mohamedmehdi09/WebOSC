"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sign, verify } from "jsonwebtoken";
import { User } from "@prisma/client";

const secret = process.env.JWT_SECRET;

export async function authenticate(
  state: { error: boolean | null; message: string },
  formData: FormData
) {
  try {
    const email = formData.get("email")?.valueOf();
    const password = formData.get("password")?.valueOf();

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user || user?.password !== password) {
      throw Error("username or password wrong");
    }

    if (!secret) throw Error("Unexpected Error");

    const token = sign(
      {
        user_id: user.user_id,
        name: user.name,
        lastname: user.lastname,
        isMale: user.isMale,
        email: user.email,
        super: user.super,
      },
      secret
    );

    cookies().set({
      name: "token",
      value: token,
      secure: process.env.NODE_ENV !== "development",
    });
    state.error = false;
    state.message = "logged in successfully";
  } catch (error: any) {
    state.error = true;
    state.message = error.message;
  }
  return state;
}

export async function createUser(
  state: { error: boolean | null; message: string },
  formData: FormData
) {
  try {
    const name = formData.get("name") as string;
    const middlename = formData.get("middlename") as string;
    const userame = formData.get("username") as string;
    const lastname = formData.get("lastname") as string;
    const isMale = formData.get("isMale") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const userCount = await prisma.user.count();
    const user = await prisma.user.create({
      data: {
        user_id: userame,
        middlename: middlename || null,
        name,
        lastname,
        isMale: isMale === "true",
        email,
        password,
        super: userCount == 0,
      },
    });

    state.error = false;
    state.message = "user created successfully!";
  } catch (error: any) {
    state.error = true;
    state.message = "unexpected error!";

    if (error.code === "P2002") {
      if (error.meta.target.includes("email"))
        state.message = "email already in use!";
      else state.message = "username already in use!";
    }
  }

  return state;
}

export async function CreateOrg(formData: FormData) {
  try {
    const org_id = formData.get("org_id") as string;
    const nameEn = formData.get("nameEn") as string;
    const nameAr = formData.get("nameAr") as string;
    const user_id = formData.get("user_id") as string;
    const parent_org_id = formData.get("parent_org_id") as string;
    const org = await prisma.organization.create({
      data: {
        org_id,
        nameEn,
        nameAr,
        parent_org_id: parent_org_id === "null" ? null : parent_org_id,
        editors: {
          create: { user: { connect: { user_id: user_id } } },
        },
      },
    });
  } catch (error: any) {
    console.log(error);
    throw Error("Error while Creating Org");
  }
  redirect("/org");
}

// export async function upadateOrg(formData: FormData) {
//   const nameEn = (formData.get("nameEn") as string) || undefined;
//   const nameAr = (formData.get("nameAr") as string) || undefined;
//   const id = formData.get("id") as string;
//   try {
//     const org = await prisma.organization.update({
//       where: { org_id: id },
//       data: { nameAr: nameAr, nameEn: nameEn },
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

export async function addEditorToOrg(
  state: { error: boolean | null; message: string },
  formData: FormData
) {
  const user_id = formData.get("user_id") as string;
  const org_id = formData.get("org_id") as string;
  try {
    const checkEditor = await prisma.editor.findFirst({
      where: { user_id: user_id, org_id: org_id },
    });

    if (checkEditor) {
      if (checkEditor.status == "active")
        throw Error("user is already an editor in this organization!");
      else {
        const editor = await prisma.editor.update({
          where: { editor_id: checkEditor.editor_id },
          data: { status: "active" },
        });
        state.message = "editor reactivated";
      }
    }

    if (!checkEditor) {
      const editor = await prisma.editor.create({
        data: { org_id: org_id, user_id: user_id },
      });
      state.message = "editor added to organization";
    }

    state.error = false;
  } catch (error: any) {
    state.error = true;
    if (
      error.meta?.target.includes("user_id") &&
      error.meta?.target.includes("org_id")
    ) {
      state.message = "user is already an editor in this orgainzation!";
    } else state.message = error.message;
  }
  return state;
}

export async function addAnnouncement(
  state: { error: boolean | null; message: string; announcement_id: number },
  formData: FormData
) {
  const org_id = formData.get("org_id") as string;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const token = cookies().get("token")?.value;

  if (!token) {
    throw Error("not authenticated");
  }
  if (!secret) {
    throw Error("Unexpecte Error");
  }

  const user = verify(token, secret) as User;
  try {
    // make sure user is editor in the target org
    const editor = await prisma.editor.findMany({
      where: { org_id: org_id, user_id: user.user_id },
    });

    if (editor.length == 0) {
      throw Error("action not allowed!");
    }

    // create announcement
    const announcement = await prisma.announcement.create({
      data: {
        title: title,
        body: body,
        editor_id: editor[0].editor_id,
        org_id: org_id,
      },
    });
    state.error = false;
    state.announcement_id = announcement.announcement_id;
    state.message = "post created successfully";
  } catch (error: any) {
    state.error = true;
    state.message = error.message;
  }
  return state;
}

export async function suspendEditor(
  state: { error: boolean | null; message: string },
  formData: FormData
) {
  const editor_id = formData.get("editor_id") as string;
  const token = cookies().get("token")?.value;

  if (!token) {
    throw Error("not authenticated");
  }
  if (!secret) {
    throw Error("Unexpecte Error");
  }

  const user = verify(token, secret) as User;
  try {
    const editor = await prisma.editor.findFirst({
      where: { editor_id },
    });

    if (!editor) {
      throw Error("editor not found!");
    }

    const checkEditor = await prisma.editor.findFirst({
      where: { org_id: editor.org_id, user_id: user.user_id },
    });

    if (!checkEditor) throw Error("action not allowed!");

    if (checkEditor.editor_id == editor_id)
      throw Error("you can't remove yourself from org!");

    const updatedEditor = await prisma.editor.update({
      where: { editor_id: editor_id },
      data: { status: "suspended" },
    });

    state.error = false;
    state.message = "editor Suspended";
  } catch (error: any) {
    state.error = true;
    state.message = error.message;
  }
  return state;
}

export async function logout(
  state: {
    error: boolean | null;
    message: string;
  },
  formData: FormData
) {
  cookies().delete("token");
  state.error = false;
  state.message = "loggged out successfully";
  return state;
}

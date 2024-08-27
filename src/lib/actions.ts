"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sign, verify } from "jsonwebtoken";
import { z } from "zod";
import { TokenPayload } from "./types";
import { mailer } from "./mailer";
import { randomUUID } from "crypto";

const secret = process.env.JWT_SECRET;

export async function login(
  state: { error: boolean | null; message: string },
  formData: FormData,
) {
  // This is a zod schema for validating the form data
  const loginShema = z.object({
    email: z.string().email({ message: "Invalid email!" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters!" }),
  });

  // We get the form data from the form submission
  const loginData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    // We parse the form data using the zod schema
    const loginParsed = loginShema.safeParse(loginData);

    // If the form data is invalid, we throw an error
    if (!loginParsed.success) {
      throw Error(loginParsed.error.issues[0].message);
    }

    // We query the user from the database using the email
    const user = await prisma.user.findFirst({
      where: { email: loginData.email },
    });

    // If the user doesn't exist or the password is incorrect, we throw an error
    if (!user || user?.password !== loginData.password)
      throw Error("Username or password is incorrect!");

    // If the secret key is not set, we throw an error
    if (!secret) throw Error("Unexpected error!");

    // We sign the user's data using the secret key
    const token = sign(
      {
        user_id: user.user_id,
        super: user.super,
        emailVerified: user.emailVerified,
      },
      secret,
    );

    // We set the token as a cookie
    cookies().set({
      name: "token",
      value: token,
      secure: process.env.NODE_ENV !== "development",
      httpOnly: false,
    });

    // If the login is successful, we set the state to indicate that
    state.error = false;
    state.message = "Welcome!";
  } catch (error: any) {
    // If there's an error, we set the state to indicate that
    state.error = true;
    state.message = error.message;
  }
  // Finally, we return the state
  return state;
}

export async function signup(
  state: { error: boolean | null; message: string },
  formData: FormData,
) {
  // We define a schema for validating the signup form data
  const signupShema = z.object({
    name: z.string().min(3, "Name too short!"),
    middlename: z.string().nullable(),
    lastname: z.string().min(3, "Lastname too short!"),
    username: z.string(),
    isMale: z.boolean().nullable(),
    email: z.string().email({ message: "Invalid email!" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters!" }),
  });

  // We get the signup form data
  const signupData = {
    name: formData.get("name") as string,
    middlename: formData.get("middlename") as string,
    lastname: formData.get("lastname") as string,
    username: formData.get("username") as string,
    isMale: (formData.get("isMale") as string) === "true",
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    // We validate the signup form data using the schema
    const signupParsed = signupShema.safeParse(signupData);
    if (!signupParsed.success)
      // If the validation fails, we throw an error
      throw signupParsed.error;

    // We check if the email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: signupData.email }, { user_id: signupData.username }],
      },
    });

    if (existingUser) {
      // If the email or username already exists, we throw an error
      if (existingUser.email === signupData.email)
        throw Error("Email is already in use!");
      else if (existingUser.user_id === signupData.username)
        throw Error("Username is already in use!");
    }

    const countUsers = await prisma.user.count();

    // We create a new user in the database
    const user = await prisma.user.create({
      data: {
        user_id: signupData.username,
        middlename: signupData.middlename,
        name: signupData.name,
        lastname: signupData.lastname,
        isMale: signupData.isMale,
        email: signupData.email,
        password: signupData.password,
        super: countUsers === 0,
      },
    });

    // Send Verification email
    // email only sent if in production
    if (process.env.NODE_ENV !== "development") {
      mailer.sendMail({
        from: "OSCA",
        to: user.email,
        subject: "Email Verification",
        html: `<h1>Hi ${user.name}</h1><p>Thanks for joining OSCA. Please verify your email by clicking on the link below.</p><a href="http://localhost:3000/emailVerification">Verify Email</a><p>and enter the following secret key: ${user.emailVerificationPhrase}</p>`,
      });
    }
    // if in development we just console.log the secret phrase
    else {
      console.log(
        "Secret key for user " +
          user.name +
          " is " +
          user.emailVerificationPhrase,
      );
    }

    // If the secret key is not set, we throw an error
    if (!secret) throw Error("Unexpected Error!");

    // We sign the user's data using the secret key
    const token = sign(
      {
        user_id: user.user_id,
        super: user.super,
        emailVerified: user.emailVerified,
      },
      secret,
    );

    // We set the token as a cookie
    cookies().set({
      name: "token",
      value: token,
      secure: process.env.NODE_ENV !== "development",
      httpOnly: false,
    });

    // If the signup is successful, we set the state to indicate that
    state.error = false;
    state.message = "User has been created successfully!";
  } catch (error: any) {
    // If there's an error, we set the state to indicate that
    state.error = true;
    state.message = error?.issues?.[0]?.message || error.message;
  }

  // Finally, we return the state
  return state;
}

export async function CreateOrg(formData: FormData) {
  try {
    // TODO: Protect this Form from unautherized access YOU IDIOT
    // TODO: add zod type checks on this form
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
    throw Error("Error while creating the organization!");
  }
  redirect("/org");
}

export async function addEditorToOrg(
  state: { error: boolean | null; message: string },
  formData: FormData,
) {
  const user_id = formData.get("user_id") as string;
  const org_id = formData.get("org_id") as string;
  try {
    const checkEditor = await prisma.editor.findFirst({
      where: { user_id: user_id, org_id: org_id },
    });

    if (checkEditor) {
      if (checkEditor.status == "active")
        throw Error("The user is already an editor in this organization!");
      else {
        const editor = await prisma.editor.update({
          where: { editor_id: checkEditor.editor_id },
          data: { status: "active" },
        });
        state.message = "Editor has been reactivated!";
      }
    }

    if (!checkEditor) {
      const editor = await prisma.editor.create({
        data: { org_id: org_id, user_id: user_id },
      });
      state.message = "Editor has been added to the organization!";
    }

    state.error = false;
  } catch (error: any) {
    state.error = true;
    if (
      error.meta?.target.includes("user_id") &&
      error.meta?.target.includes("org_id")
    ) {
      state.message = "User is already an editor in this organization!";
    } else state.message = error.message;
  }
  return state;
}

export async function addAnnouncement(
  state: { error: boolean | null; message: string; announcement_id: number },
  formData: FormData,
) {
  try {
    const org_id = formData.get("org_id") as string;
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const token = cookies().get("token")?.value;

    if (!token) {
      throw Error("Not authenticated!");
    }
    if (!secret) {
      throw Error("Unexpected error!");
    }

    const user = verify(token, secret) as TokenPayload;

    if (!user.emailVerified) throw Error("Email not verified!");

    // make sure user is editor in the target org
    const editor = await prisma.editor.findMany({
      where: { org_id: org_id, user_id: user.user_id },
    });

    if (editor.length == 0) {
      throw Error("Action not allowed!");
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
    state.message = "The post was created successfully!";
  } catch (error: any) {
    state.error = true;
    state.message = error.message;
  }
  return state;
}

export async function suspendEditor(
  state: { error: boolean | null; message: string },
  formData: FormData,
) {
  try {
    const editor_id = formData.get("editor_id") as string;
    const token = cookies().get("token")?.value;

    if (!token) {
      throw Error("Not authenticated!");
    }
    if (!secret) {
      throw Error("Unexpected error!");
    }

    const user = verify(token, secret) as TokenPayload;

    if (!user.emailVerified) throw Error("Email not verified!");

    const editor = await prisma.editor.findFirst({
      where: { editor_id },
    });

    if (!editor) {
      throw Error("Editor not found!");
    }

    const checkEditor = await prisma.editor.findFirst({
      where: { org_id: editor.org_id, user_id: user.user_id },
    });

    if (!checkEditor || checkEditor.status === "suspended")
      throw Error("Action not allowed!");

    if (checkEditor.editor_id == editor_id)
      throw Error("You can't remove yourself from the organization!");

    const updatedEditor = await prisma.editor.update({
      where: { editor_id: editor_id },
      data: { status: "suspended" },
    });

    state.error = false;
    state.message = "The editor has been suspended!";
  } catch (error: any) {
    state.error = true;
    state.message = error.message;
  }
  return state;
}

export async function activateEditor(
  state: { error: boolean | null; message: string },
  formData: FormData,
) {
  try {
    const editor_id = formData.get("editor_id") as string;
    const token = cookies().get("token")?.value;

    if (!token) {
      throw Error("Not authenticated!");
    }
    if (!secret) {
      throw Error("Unexpected error!");
    }

    const user = verify(token, secret) as TokenPayload;

    if (!user.emailVerified) throw Error("Email not verified!");

    const editor = await prisma.editor.findFirst({
      where: { editor_id },
    });

    if (!editor) throw Error("Editor not found!");

    if (editor.status == "active") throw Error("Editor is already active!");

    const checkEditor = await prisma.editor.findFirst({
      where: { org_id: editor.org_id, user_id: user.user_id },
    });

    if (
      !checkEditor ||
      checkEditor.status === "suspended" ||
      checkEditor.editor_id == editor_id
    )
      throw Error("Not authorized!");

    const updatedEditor = await prisma.editor.update({
      where: { editor_id: editor_id },
      data: { status: "active" },
    });

    state.error = false;
    state.message = "Editor reactivated!";
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
  formData: FormData,
) {
  cookies().delete("token");
  state.error = false;
  state.message = "Successfully logged out!";
  return state;
}

export async function verifyEmail(
  state: { success: boolean | null; message: string },
  formData: FormData,
) {
  const token = cookies().get("token")?.value;

  if (!token) {
    state = {
      success: false,
      message: "You must be logged in to verify your email!",
    };
    return state;
  }

  if (!secret) {
    state = {
      success: false,
      message: "Internal error. Please try again later!",
    };
    return state;
  }

  const userToken = verify(token, secret) as TokenPayload;

  if (!userToken) {
    cookies().delete("token");
    state = {
      success: false,
      message: "Something went wrong. Please try again later!",
    };
    return state;
  }

  if (userToken.emailVerified) {
    state = { success: false, message: "Email is already verified!" };
    return state;
  }

  const user = await prisma.user.findUnique({
    where: { user_id: userToken.user_id },
  });

  if (!user) {
    cookies().delete("token");
    state = {
      success: false,
      message: "Something went wrong. Please try again later!",
    };
    return state;
  }
  if (user.emailVerified) {
    state = { success: false, message: "Email is already verified!" };
    return state;
  }

  const emailVerificationPhrase = formData.get(
    "emailVerificationPhrase",
  ) as string;

  if (user.emailVerificationPhrase !== emailVerificationPhrase) {
    state = {
      success: false,
      message: "Invalid passphrase. Please try again!",
    };
    return state;
  }

  const updatedUser = await prisma.user.update({
    where: { user_id: user.user_id },
    data: { emailVerified: true, emailVerificationPhrase: null },
  });

  const newToken = sign(
    {
      user_id: updatedUser.user_id,
      emailVerified: updatedUser.emailVerified,
      super: updatedUser.super,
    },
    secret,
  );

  cookies().set({
    name: "token",
    value: newToken,
    secure: process.env.NODE_ENV !== "development",
    httpOnly: false,
  });

  state = { success: true, message: "Email verified!" };
  return state;
}

export async function resendVerificationEmail(
  state: { success: boolean | null; message: string },
  formData: FormData,
) {
  const token = cookies().get("token")?.value;

  if (!token) {
    state = {
      success: false,
      message: "You must be logged in to verify your email!",
    };
    return state;
  }

  if (!secret) {
    state = {
      success: false,
      message: "Internal error. Please try again later!",
    };
    return state;
  }

  const userToken = verify(token, secret) as TokenPayload;

  if (!userToken) {
    cookies().delete("token");
    state = {
      success: false,
      message: "Something went wrong. Please try again later!",
    };
    return state;
  }

  if (userToken.emailVerified) {
    state = { success: false, message: "Email is already verified!" };
    return state;
  }

  const user = await prisma.user.findUnique({
    where: { user_id: userToken.user_id },
  });

  if (!user) {
    cookies().delete("token");
    state = {
      success: false,
      message: "Something went wrong. Please try again later!",
    };
    return state;
  }
  if (user.emailVerified) {
    state = { success: false, message: "Email is already verified!" };
    return state;
  }

  const newEmailVerificationPhrase = randomUUID();

  const updatedUser = await prisma.user.update({
    where: { user_id: user.user_id },
    data: { emailVerificationPhrase: newEmailVerificationPhrase },
  });

  if (process.env.NODE_ENV !== "development") {
    mailer.sendMail({
      from: "OSCA",
      to: user.email,
      subject: "Email Verification",
      html: `<h1>Hi ${updatedUser.name}</h1><p>Thanks for joining OSCA. Please verify your email by clicking on the link below.</p><a href="http://localhost:3000/emailVerification">Verify Email</a><p>and enter the following secret key: ${updatedUser.emailVerificationPhrase}</p>`,
    });
  }
  // if in development we just console.log the secret phrase
  else {
    console.log(
      "New secret key for user " +
        updatedUser.name +
        " is " +
        updatedUser.emailVerificationPhrase,
    );
  }

  state = { success: true, message: "Email resent! Please check your inbox!" };
  return state;
}

"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sign, verify } from "jsonwebtoken";
import { z } from "zod";
import { ActionError, TokenPayload } from "./types";
import { mailer } from "./mailer";
import { hash, randomUUID } from "crypto";
import { Email, User } from "@prisma/client";

const secret = process.env.JWT_SECRET;

export async function login(
  state: { error: boolean | null; message: string },
  formData: FormData
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
      include: {
        PrimaryEmail: true,
      },
    });

    const passwordHash =
      process.env.NODE_ENV == "development"
        ? loginData.password
        : hash("sha512", loginData.password);

    // If the user doesn't exist or the password is incorrect, we throw an error
    if (!user || user?.password !== passwordHash)
      throw Error("Username or password is incorrect!");

    // If the secret key is not set, we throw an error
    if (!secret) throw Error("Unexpected error!");

    // We sign the user's data using the secret key
    const token = sign(
      {
        user_id: user.user_id,
        super: user.super,
        emailVerified: user.PrimaryEmail.emailVerified,
      },
      secret
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
  formData: FormData
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

    const passwordHash =
      process.env.NODE_ENV == "development"
        ? signupData.password
        : hash("sha512", signupData.password);

    // We create a new user in the database along with the associated email
    const user = await prisma.user.create({
      data: {
        user_id: signupData.username,
        middlename: signupData.middlename,
        name: signupData.name,
        lastname: signupData.lastname,
        isMale: signupData.isMale,
        password: passwordHash,
        super: countUsers === 0,
        PrimaryEmail: {
          create: {
            email: signupData.email,
          },
        },
      },
      include: {
        PrimaryEmail: true,
      },
    });

    // Send Verification email
    // email only sent if in production
    if (process.env.NODE_ENV !== "development") {
      mailer.sendMail({
        from: "OSCA",
        to: user.email,
        subject: "Email Verification",
        html: generateEmailHTML(user),
      });
    }
    // if in development we just console.log the secret phrase
    else {
      console.log(
        "Secret key for user " +
          user.name +
          " is " +
          user.PrimaryEmail.emailVerificationPhrase
      );
    }

    // If the secret key is not set, we throw an error
    if (!secret) throw Error("Unexpected Error!");

    // We sign the user's data using the secret key
    const token = sign(
      {
        user_id: user.user_id,
        super: user.super,
        emailVerified: user.PrimaryEmail.emailVerified,
      },
      secret
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

// done
export async function addEditorToOrg(
  state: { error: boolean | null; message: string },
  formData: FormData
) {
  const addEditorFormSchema = z.object({
    org_id: z.string().min(4, { message: "Organization ID is required!" }),
    user_id: z.string().min(6, { message: "User ID is required!" }),
  });

  try {
    // validate form
    const addEditorFormData = {
      org_id: formData.get("org_id") as string,
      user_id: formData.get("user_id") as string,
    };

    const parsAddEditorForm = addEditorFormSchema.safeParse(addEditorFormData);

    if (!parsAddEditorForm.success)
      throw new ActionError(parsAddEditorForm.error.issues[0].message);

    // authenticate user
    const user = authenticateUser();

    // check if org exists

    const checkOrg = await prisma.organization.findFirst({
      where: {
        org_id: addEditorFormData.org_id,
      },
    });

    if (!checkOrg) throw new ActionError("Organization Not Found!");

    // authorize user
    const checkEditorPrivilages = await prisma.editor.findFirst({
      where: {
        user_id: user.user_id,
        org_id: addEditorFormData.org_id,
      },
    });

    if (!checkEditorPrivilages)
      throw new ActionError("You Are not An Editor Of This Organization!");

    if (checkEditorPrivilages.status !== "active")
      throw new ActionError(
        "You Are not An Editor Of This Organization anymore!"
      );

    // check if added user exists

    const checkUser = await prisma.user.findFirst({
      where: {
        user_id: addEditorFormData.user_id,
      },
      include: {
        PrimaryEmail: true,
      },
    });

    if (!checkUser) throw new ActionError("User Not Found!");

    // check if added user email is verified

    if (!checkUser.PrimaryEmail.emailVerified)
      throw new ActionError(
        "You are trying to add a User with an unverified Email"
      );

    // add editor
    const checkEditor = await prisma.editor.findFirst({
      where: {
        user_id: addEditorFormData.user_id,
        org_id: addEditorFormData.org_id,
      },
    });

    if (!checkEditor) {
      const editor = await prisma.editor.create({
        data: {
          org_id: addEditorFormData.org_id,
          user_id: addEditorFormData.user_id,
        },
      });
      state.message = "Editor has been added to the organization!";
    } else {
      if (checkEditor.status == "active")
        throw new ActionError(
          "The user is already an editor in this organization!"
        );
      else {
        const editor = await prisma.editor.update({
          where: { editor_id: checkEditor.editor_id },
          data: { status: "active" },
        });
        state.message = "Editor has been reactivated!";
      }
    }

    state.error = false;
  } catch (error: any) {
    state.error = true;
    if (error instanceof ActionError) state.message = error.message;
    else state.message = "Something went wrong. Please try again later!";
  }
  return state;
}

// done
export async function addAnnouncement(
  state: { error: boolean | null; message: string; announcement_id: number },
  formData: FormData
) {
  const addAnnouncementFormSchema = z.object({
    org_id: z.string().min(4, { message: "Organization ID is required!" }),
    title: z.string().min(1, { message: "Title is required!" }).max(40, {
      message: "Title must be less than 40 characters!",
    }),
    body: z.string().min(1, { message: "Body is required!" }),
  });
  try {
    const addAnnouncementFormData = {
      org_id: formData.get("org_id") as string,
      title: formData.get("title") as string,
      body: formData.get("body") as string,
    };

    // authenticate user
    const user = authenticateUser();

    // check if org exists

    const checkOrg = await prisma.organization.findFirst({
      where: {
        org_id: addAnnouncementFormData.org_id,
      },
    });

    if (!checkOrg) throw new ActionError("Organization Not Found!");

    // authorize user

    const checkEditorPrivilages = await prisma.editor.findFirst({
      where: {
        user_id: user.user_id,
        org_id: addAnnouncementFormData.org_id,
      },
    });

    if (!checkEditorPrivilages)
      throw new ActionError("You Are not An Editor Of This Organization!");

    if (checkEditorPrivilages.status !== "active")
      throw new ActionError(
        "You Are not An Editor Of This Organization anymore!"
      );

    // validate form
    const parsedAddAnnouncementFormData = addAnnouncementFormSchema.safeParse(
      addAnnouncementFormData
    );

    if (!parsedAddAnnouncementFormData.success) {
      throw new ActionError(
        parsedAddAnnouncementFormData.error.issues[0].message
      );
    }

    // create announcement
    const announcement = await prisma.announcement.create({
      data: {
        title: addAnnouncementFormData.title,
        body: addAnnouncementFormData.body,
        editor_id: checkEditorPrivilages.editor_id,
        org_id: addAnnouncementFormData.org_id,
      },
    });
    state.error = false;
    state.announcement_id = announcement.announcement_id;
    state.message = "The announcement was created successfully!";
  } catch (error: any) {
    state.error = true;
    if (error instanceof ActionError) state.message = error.message;
    else state.message = "Something went wrong. Please try again later!";
  }
  return state;
}

// done
export async function suspendEditor(
  state: { error: boolean | null; message: string },
  formData: FormData
) {
  const suspendEditorFormSchema = z.object({
    editor_id: z.string().uuid({ message: "Invalid editor id!" }),
  });
  try {
    // authenticate user
    const user = authenticateUser();

    // validate form
    const suspendEditorFormData = {
      editor_id: formData.get("editor_id") as string,
    };

    const parsedSuspendEditorFormData = suspendEditorFormSchema.safeParse(
      suspendEditorFormData
    );

    if (!parsedSuspendEditorFormData.success) {
      throw new ActionError(
        parsedSuspendEditorFormData.error.issues[0].message
      );
    }

    // check if editor exists

    const editor = await prisma.editor.findFirst({
      where: { editor_id: suspendEditorFormData.editor_id },
    });

    if (!editor) {
      throw new ActionError("Editor not found!");
    }

    if (editor.status == "suspended")
      throw new ActionError("The editor is already suspended!");

    // authorize user

    const checkEditor = await prisma.editor.findFirst({
      where: { org_id: editor.org_id, user_id: user.user_id },
    });

    if (!checkEditor)
      throw new ActionError("You are not An Editor in this organization!");

    if (checkEditor.status == "suspended")
      throw new ActionError(
        "You are not An Editor in this organization Anymore!"
      );

    if (checkEditor.editor_id == suspendEditorFormData.editor_id)
      throw new ActionError("You can't remove yourself from the organization!");

    const updatedEditor = await prisma.editor.update({
      where: { editor_id: suspendEditorFormData.editor_id },
      data: { status: "suspended" },
    });

    state.error = false;
    state.message = "The editor has been suspended!";
  } catch (error: any) {
    state.error = true;
    if (error instanceof ActionError) state.message = error.message;
    else state.message = "Something went wrong. Please try again later!";
  }
  return state;
}

// done
export async function activateEditor(
  state: { error: boolean | null; message: string },
  formData: FormData
) {
  const activateEditorFormSchema = z.object({
    editor_id: z.string().uuid({ message: "Invalid editor id!" }),
  });
  try {
    // authenticate user
    const user = authenticateUser();

    // validate form
    const activateEditorFormData = {
      editor_id: formData.get("editor_id") as string,
    };

    const parsedActivateEditorFormData = activateEditorFormSchema.safeParse(
      activateEditorFormData
    );

    if (!parsedActivateEditorFormData.success) {
      throw new ActionError(
        parsedActivateEditorFormData.error.issues[0].message
      );
    }

    // check if editor exists

    const editor = await prisma.editor.findFirst({
      where: { editor_id: activateEditorFormData.editor_id },
    });

    if (!editor) {
      throw new ActionError("Editor not found!");
    }

    if (editor.status == "active")
      throw new ActionError("The editor is already active!");

    // authorize user

    const checkEditor = await prisma.editor.findFirst({
      where: { org_id: editor.org_id, user_id: user.user_id },
    });

    if (!checkEditor)
      throw new ActionError("You are not An Editor in this organization!");

    if (checkEditor.status == "suspended")
      throw new ActionError(
        "You are not An Editor in this organization Anymore!"
      );

    const updatedEditor = await prisma.editor.update({
      where: { editor_id: activateEditorFormData.editor_id },
      data: { status: "active" },
    });

    state.error = false;
    state.message = "The editor has been reactivated!";
  } catch (error: any) {
    state.error = true;
    if (error instanceof ActionError) state.message = error.message;
    else state.message = "Something went wrong. Please try again later!";
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
  state.message = "Successfully logged out!";
  return state;
}

// done
export async function verifyEmail(
  state: { success: boolean | null; message: string },
  formData: FormData
) {
  const verifyEmailFormSchema = z.object({
    emailVerificationPhrase: z
      .string()
      .uuid({ message: "Invalid passphrase!" }),
  });
  try {
    // First, we authenticate the user
    const user = authenticateUser();

    // check if user exists

    const checkUser = await prisma.user.findUnique({
      where: { user_id: user.user_id },
      include: { PrimaryEmail: true },
    });

    if (!checkUser) {
      cookies().delete("token");
      throw new ActionError("Something went wrong. Please try again later!");
    }

    if (checkUser.PrimaryEmail.emailVerified)
      throw new ActionError("Email is already verified!");

    // validate form
    const verifyEmailFormData = {
      emailVerificationPhrase: formData.get(
        "emailVerificationPhrase"
      ) as string,
    };

    const parsedVerifyEmailFormData =
      verifyEmailFormSchema.safeParse(verifyEmailFormData);

    if (!parsedVerifyEmailFormData.success) {
      throw new ActionError(parsedVerifyEmailFormData.error.issues[0].message);
    }

    // check if pass phrase is valid

    if (
      checkUser.PrimaryEmail.emailVerificationPhrase !==
      verifyEmailFormData.emailVerificationPhrase
    ) {
      throw new ActionError("Invalid email verification phrase!");
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        PrimaryEmail: {
          update: { emailVerified: true, emailVerificationPhrase: null },
        },
      },
      include: { PrimaryEmail: true },
    });

    if (!secret) {
      state = {
        success: false,
        message: "Unexpected error!",
      };
      return state;
    }

    // We sign a new token using the updated user's data and the secret
    const newToken = sign(
      {
        user_id: updatedUser.user_id,
        emailVerified: updatedUser.PrimaryEmail.emailVerified,
        super: updatedUser.super,
      },
      secret
    );

    // We set the new token as the value of the token cookie
    cookies().set({
      name: "token",
      value: newToken,
      secure: process.env.NODE_ENV !== "development",
      httpOnly: false,
    });

    state.success = true;
    state.message = "Email verified!";
  } catch (error) {
    state.success = false;
    if (error instanceof Error) state.message = error.message;
    else state.message = "Something went wrong. Please try again later!";
  }
  return state;
}

export async function resendVerificationEmail(
  state: { success: boolean | null; message: string },
  formData: FormData
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
    include: { PrimaryEmail: true },
  });

  if (!user) {
    cookies().delete("token");
    state = {
      success: false,
      message: "Something went wrong. Please try again later!",
    };
    return state;
  }
  if (user.PrimaryEmail.emailVerified) {
    state = { success: false, message: "Email is already verified!" };
    return state;
  }

  const newEmailVerificationPhrase = randomUUID();

  const updatedUser = await prisma.user.update({
    where: { user_id: user.user_id },
    data: {
      PrimaryEmail: {
        update: {
          emailVerificationPhrase: newEmailVerificationPhrase,
        },
      },
    },
    include: {
      PrimaryEmail: true,
    },
  });

  if (process.env.NODE_ENV !== "development") {
    mailer.sendMail({
      from: "OSCA",
      to: user.email,
      subject: "Email Verification",
      html: generateEmailHTML(updatedUser),
    });
  }
  // if in development we just console.log the secret phrase
  else {
    console.log(
      "New secret key for user " +
        updatedUser.name +
        " is " +
        updatedUser.PrimaryEmail.emailVerificationPhrase
    );
  }

  state = { success: true, message: "Email resent! Please check your inbox!" };
  return state;
}

export async function changeEmail(
  state: { success: boolean | null; message: string },
  formData: FormData
) {
  const user = authenticateUser();

  // Next, we check if the user's email is already verified
  if (user.emailVerified) {
    // If the email is already verified, we return an error message indicating that the email is already verified
    state = { success: false, message: "Email is already verified!" };
    return state;
  }

  // Then, we query the user and their primary email address from the database
  const checkUser = await prisma.user.findUnique({
    where: { user_id: user.user_id },
    include: { PrimaryEmail: true },
  });

  // If the user or their primary email address can't be found, we delete the token cookie and return an error message
  if (!checkUser) {
    cookies().delete("token");
    state = {
      success: false,
      message: "Something went wrong. Please try again later!",
    };
    return state;
  }

  // Next, we check if the user's primary email address is already verified
  if (checkUser.PrimaryEmail.emailVerified) {
    // If the email is already verified, we return an error message indicating that the email is already verified
    state = { success: false, message: "Email is already verified!" };
    return state;
  }

  // Then, we get the email verification phrase from the form data
  const newEmail = formData.get("email") as string;

  const emailSchema = z
    .string({ message: "email field must be a string!" })
    .email({ message: "Invalid email!" });

  const parsedEmail = emailSchema.safeParse(newEmail);

  if (!parsedEmail.success) {
    state = { success: false, message: parsedEmail.error.issues[0].message };
    return state;
  }

  // make sure email is not already in use
  const emailInUse = await prisma.email.count({
    where: { email: newEmail },
  });

  if (emailInUse > 0) {
    state = { success: false, message: "Email already in use!" };
    return state;
  }

  // Finally, we update the user's primary email address to set the emailVerified flag to true and null out the email verification phrase
  const updatedUser = await prisma.user.update({
    where: { user_id: user.user_id },
    data: {
      PrimaryEmail: {
        create: { email: newEmail },
      },
    },
    include: { PrimaryEmail: true },
  });

  // delete old email
  await prisma.email.delete({
    where: { email: checkUser.PrimaryEmail.email },
  });

  // Send Verification email
  // email only sent if in production
  if (process.env.NODE_ENV !== "development") {
    mailer.sendMail({
      from: "OSCA",
      to: checkUser.email,
      subject: "Email Verification",
      html: generateEmailHTML(updatedUser),
    });
  }
  // if in development we just console.log the secret phrase
  else {
    console.log(
      "Secret key for user " +
        updatedUser.name +
        " is " +
        updatedUser.PrimaryEmail.emailVerificationPhrase +
        " sent to email " +
        updatedUser.email
    );
  }

  // Finally, we return a success message indicating that the email has been verified
  state = {
    success: true,
    message: "Email updated! and email verification sent",
  };
  return state;
}

function authenticateUser() {
  const token = cookies().get("token")?.value;

  if (!token) throw new ActionError("You are not Logged In!");

  if (!secret) throw new ActionError("Internal error. Please try again later!");

  let user;
  try {
    user = verify(token, secret) as TokenPayload;
  } catch (error) {
    cookies().delete("token");
    console.log("unverified token");
    throw new ActionError("Token invalid or expired. Please log in again!");
  }

  return user;
}

function generateEmailHTML(user: User & { PrimaryEmail: Email }) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style> 
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #4a4a4a; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; }
        .secret-key { background-color: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="container">
      <h1>Hi ${user.name},</h1>
      <p>Thanks for joining OSCA. Please verify your email by clicking on the button below.</p>
      <p><a href="${process.env.HOSTNAME}/verify-email" class="btn">Verify Email</a></p>
      <p>Then, enter the following secret key:</p>
      <p class="secret-key">
        ${user.PrimaryEmail.emailVerificationPhrase}
      </p>
      </div>
    </body>
  </html>`;
}

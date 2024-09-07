"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { z } from "zod";
import { ActionError, FormState, TokenPayload } from "@/lib/types";

export async function createAnnouncement(state: FormState, formData: FormData) {
  const createAnnouncementFormSchema = z.object({
    org_id: z.string().min(4, { message: "Organization ID is required!" }),
    title: z.string().min(1, { message: "Title is required!" }).max(40, {
      message: "Title must be less than 40 characters!",
    }),
    body: z.string().min(1, { message: "Body is required!" }),
    publishes_at: z.date({ message: "publishing date is required" }),
    ends_at: z.date({ message: "publishing ending date is required" }),
  });
  try {
    const createAnnouncementFormData = {
      org_id: formData.get("org_id") as string,
      title: formData.get("title") as string,
      body: formData.get("body") as string,
      publishes_at: (formData.get("publishes_at") as string)
        ? new Date(formData.get("publishes_at") as string)
        : null,
      ends_at: (formData.get("ends_at") as string)
        ? new Date(formData.get("ends_at") as string)
        : null,
    };

    // authenticate user
    const user = authenticateUser();

    // authenticate editor
    const editor = await authenticateEditor(
      user,
      createAnnouncementFormData.org_id,
    );

    // validate form
    const parsedCreateAnnouncementFormData =
      createAnnouncementFormSchema.safeParse(createAnnouncementFormData);

    if (!parsedCreateAnnouncementFormData.success) {
      throw new ActionError(
        parsedCreateAnnouncementFormData.error.issues[0].message,
      );
    }

    const validatedFormData = parsedCreateAnnouncementFormData.data;

    // make sure publish date is in the future
    if (new Date() > validatedFormData.publishes_at)
      throw new ActionError("publish date cannot be in the past");

    // make sure ends date is not before publish date
    if (validatedFormData.publishes_at > validatedFormData.ends_at)
      throw new ActionError(
        "ends publishing date must be after publishing date",
      );

    // create the announcement
    const announcement = await prisma.announcement.create({
      data: {
        title: validatedFormData.title,
        body: validatedFormData.body,
        editor_id: editor.editor_id,
        org_id: validatedFormData.org_id,
        publishes_at: validatedFormData.publishes_at,
        ends_at: validatedFormData.ends_at,
      },
    });

    state = {
      success: true,
      redirect: `/announcement/${announcement.announcement_id}`,
      message: "The announcement was created successfully!",
    };
  } catch (error: any) {
    state.success = false;
    if (error instanceof ActionError) state.message = error.message;
    else state.message = "Something went wrong. Please try again later!";
  }
  return state;
}

export async function updateAnnoucementTitle(
  state: FormState,
  formData: FormData,
) {
  const updateAnnoucementTitleFormSchema = z.object({
    announcement_id: z.number(),
    title: z.string().min(5, { message: "Title is required!" }).max(40, {
      message: "Title must be less than 40 characters!",
    }),
  });
  try {
    // authenticate user
    const user = authenticateUser();

    // validate form
    const updateAnnoucementTitleFormData = {
      announcement_id: Number(formData.get("announcement_id") as string),
      title: formData.get("title") as string,
    };

    const parsedUpdateAnnoucementTitleForm =
      updateAnnoucementTitleFormSchema.safeParse(
        updateAnnoucementTitleFormData,
      );

    if (!parsedUpdateAnnoucementTitleForm.success)
      throw new ActionError(
        parsedUpdateAnnoucementTitleForm.error.issues[0].message,
      );

    const validatedFormData = parsedUpdateAnnoucementTitleForm.data;

    // check if announcement exists
    const announcement = await prisma.announcement.findFirst({
      where: {
        announcement_id: validatedFormData.announcement_id,
      },
    });

    if (!announcement) throw new ActionError("Announcement does not exist!");

    // check if user is editor in announcement org
    const editor = prisma.editor.findFirst({
      where: { org_id: announcement.org_id, user_id: user.user_id },
    });
    if (!editor)
      throw new ActionError("You are not allowed to preform this action!");

    // update announcement
    const updatedAnnouncement = await prisma.announcement.update({
      where: { announcement_id: announcement.announcement_id },
      data: { title: validatedFormData.title },
    });

    state = {
      success: true,
      message: "Announcement title updated successfully!",
      redirect: `/announcement/${updatedAnnouncement.announcement_id}`,
    };
  } catch (error) {
    state.success = false;
    if (error instanceof ActionError) state.message = error.message;
    state.message = "Unexpected error. Please try again later!";
  }
  return state;
}

const secret = process.env.JWT_SECRET;

function authenticateUser() {
  const token = cookies().get("token")?.value;

  if (!token) throw new ActionError("You are not Logged In!");

  if (!secret) throw new ActionError("Internal error. Please try again later!");

  try {
    const user = verify(token, secret) as TokenPayload;
    return user;
  } catch (error) {
    cookies().delete("token");
    throw new ActionError("Token invalid or expired. Please log in again!");
  }
}

async function authenticateEditor(user: TokenPayload, org_id: string) {
  // check if org exists
  const checkOrg = await prisma.organization.findFirst({
    where: {
      org_id: org_id,
    },
  });

  if (!checkOrg) throw new ActionError("Organization Not Found!");

  // authorize user
  const checkEditorPrivilages = await prisma.editor.findFirst({
    where: {
      user_id: user.user_id,
      org_id: org_id,
    },
  });

  if (!checkEditorPrivilages)
    throw new ActionError("You are not an Editor in this organization!");

  if (checkEditorPrivilages.status !== "active")
    throw new ActionError("You are no longer an Editor in this organization!");

  return checkEditorPrivilages;
}

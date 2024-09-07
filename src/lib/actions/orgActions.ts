"use server";

import { prisma } from "@/lib/prisma";
import { ActionError, FormState } from "../types";
import { z } from "zod";
import { authenticateUser } from "../actions";

export async function createSubOrg(state: FormState, formData: FormData) {
  const createSubOrgFormShema = z.object({
    org_id: z.string(),
    nameEn: z.string(),
    nameAr: z.string(),
    user_id: z.string(),
    parent_org_id: z.string(),
  });
  try {
    console.log("heererere");
    //authorize user
    const user = await authenticateUser();

    // validate form
    const createSubOrgFormData = {
      org_id: formData.get("org_id") as string,
      nameEn: formData.get("nameEn") as string,
      nameAr: formData.get("nameAr") as string,
      user_id: formData.get("user_id") as string,
      parent_org_id: formData.get("parent_org_id") as string,
    };

    const createSubOrgFormParsed =
      createSubOrgFormShema.safeParse(createSubOrgFormData);

    if (!createSubOrgFormParsed.success)
      throw new ActionError(createSubOrgFormParsed.error.issues[0].message);

    const validatedFormData = createSubOrgFormParsed.data;

    //check if parent org exists
    const parent_org = await prisma.organization.findUnique({
      where: { org_id: validatedFormData.parent_org_id },
    });

    if (!parent_org) {
      throw new ActionError("Parent organization does not exist!");
    }

    // check if user is super user or editor in the parent org
    const userInParentOrg = prisma.editor.findFirst({
      where: {
        user_id: user.user_id,
        org_id: validatedFormData.parent_org_id,
        status: "active",
      },
    });

    if (!userInParentOrg && !user.super) {
      throw new ActionError("action not allowed");
    }

    // check if user exists
    const userExists = await prisma.user.findUnique({
      where: { user_id: validatedFormData.user_id },
    });

    if (!userExists) {
      throw new ActionError("User Spacified does not exist!");
    }

    // check if org exists
    const orgExists = await prisma.organization.findUnique({
      where: { org_id: validatedFormData.org_id },
    });

    if (orgExists) {
      throw new ActionError("Organization already exists!");
    }

    const subOrg = await prisma.organization.create({
      data: {
        org_id: validatedFormData.org_id,
        nameEn: validatedFormData.nameEn,
        nameAr: validatedFormData.nameAr,
        parent_org_id: validatedFormData.parent_org_id,
        editors: {
          create: { user: { connect: { user_id: validatedFormData.user_id } } },
        },
      },
    });

    state = {
      success: true,
      message: "Organization created successfully!",
      redirect: `/org/${subOrg.org_id}`,
    };
  } catch (error: any) {
    state.success = false;
    if (error instanceof ActionError) state.message = error.message;
    else
      state.message =
        "An error occurred while creating the organization. Please try again later.";
  }
  return state;
}

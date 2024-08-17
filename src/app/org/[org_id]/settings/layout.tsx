"server only";

import SettingsSideBar from "@/components/SettingsSideBar";
import { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import ChangeFormInput from "@/components/UpdateOrgForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decode, verify } from "jsonwebtoken";
import { User } from "@prisma/client";

const isAuth = async (org_id: string) => {
  const token = cookies().get("token")?.value;
  if (!token) return false;
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  const user = verify(token, secret) as User;
  if (!user) return false;

  const editor = await prisma.editor.findMany({
    where: { user_id: user.user_id, org_id: org_id },
  });
  console.log(editor);
  return editor.length > 0;
};

export default async function OrgSettingsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { org_id: string };
}) {
  const isAutherized = await isAuth(params.org_id);
  if (isAutherized)
    return (
      <div className="flex flex-1 w-full rounded-md">
        <SettingsSideBar org_id={params.org_id} />
        <div className="flex flex-1 p-2 relative">{children}</div>
      </div>
    );
  else return "not allowed";
}

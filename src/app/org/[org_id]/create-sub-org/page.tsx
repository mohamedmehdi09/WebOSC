import {
  checkEmailValidation,
  checkOrgPrivilage,
  checkSuperUser,
} from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CreateSubOrgForm from "@/components/forms/CreateSubOrgForm";

async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      user_id: true,
      name: true,
      lastname: true,
      middlename: true,
      email: true,
      isMale: true,
    },

    where: { PrimaryEmail: { emailVerified: true } },
  });
  return users;
}

export default async function CreateSubOrgPage({
  params,
}: {
  params: { org_id: string };
}) {
  if (!checkSuperUser() && !checkOrgPrivilage(params.org_id))
    return <>not allowed!</>;
  if (!checkEmailValidation()) return redirect("/email/verify");

  const users = await getUsers();
  return <CreateSubOrgForm users={users} parent_org_id={params.org_id} />;
}

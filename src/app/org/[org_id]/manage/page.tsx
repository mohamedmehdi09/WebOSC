import { prisma } from "@/lib/prisma";
import ChangeFormInput from "@/components/UpdateOrgForm";

async function getOrg(org_id: string) {
  try {
    console.log(org_id);
    const org = await prisma.organization.findUniqueOrThrow({
      where: { id: org_id },
    });
    return org;
  } catch (error) {
    console.log(error);
    throw Error("org not found");
  }
}

export default async function ManageOrgPage({
  params,
}: {
  params: { org_id: string };
}) {
  const org = await getOrg(params.org_id);
  return <ChangeFormInput org={org} />;
}

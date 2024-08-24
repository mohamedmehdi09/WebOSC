import { prisma } from "@/lib/prisma";
import ChangeFormInput from "@/components/UpdateOrgForm";

async function getOrg(org_id: string) {
  try {
    const org = await prisma.organization.findUniqueOrThrow({
      where: { org_id: org_id },
    });
    return org;
  } catch (error) {
    throw Error("org not found");
  }
}

export default async function OegSettingsPage({
  params,
}: {
  params: { org_id: string };
}) {
  const org = await getOrg(params.org_id);
  return <></>;
}

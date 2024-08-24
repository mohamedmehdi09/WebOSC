import { prisma } from "@/lib/prisma";

async function getOrg(org_id: string) {
  try {
    const org = await prisma.organization.findUniqueOrThrow({
      where: { org_id: org_id },
    });
    return org;
  } catch (error) {
    console.log(error);
    throw Error("org not found");
  }
}

export default async function OrgPage({
  params,
}: {
  params: { org_id: string };
}) {
  const org = await getOrg(params.org_id);
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="text-xl font-semibold text-gray-300">
        English Name: <span className="font-normal">{org.nameEn}</span>
      </div>
      <div className="text-xl font-semibold text-gray-300">
        Arabic Name: <span className="font-normal">{org.nameAr}</span>
      </div>
    </div>
  );
}

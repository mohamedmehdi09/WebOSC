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
    <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10 lg:p-12 max-w-3xl mx-auto bg-gradient-to-r from-green-700 to-gray-800 rounded-xl shadow-2xl">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <label className="text-xl font-bold text-gray-100 tracking-wide sm:text-2xl">
            English Name:
          </label>
          <p className="mt-2 text-lg sm:text-xl text-gray-200 sm:mt-0 sm:ml-6">
            {org.nameEn}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <label className="text-xl font-bold text-gray-100 tracking-wide sm:text-2xl">
            Arabic Name:
          </label>
          <p className="mt-2 text-lg sm:text-xl text-gray-200 sm:mt-0 sm:ml-6">
            {org.nameAr}
          </p>
        </div>
      </div>
    </div>
  );
}

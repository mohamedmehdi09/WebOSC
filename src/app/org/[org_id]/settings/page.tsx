import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getSubOrgs(org_id: string) {
  return prisma.organization.findMany({ where: { parent_org_id: org_id } });
}

export default async function OrgSettingsPage({
  params,
}: {
  params: { org_id: string };
}) {
  const subOrgs = await getSubOrgs(params.org_id);
  return (
    <div className="p-6 lg:p-8 w-full max-w-7xl mx-auto border border-gray-700">
      {/* Page Heading */}
      <ul className="flex items-center gap-2 border-b border-gray-700 w-full mb-6">
        <li className="border-b border-blue-500 text-lg lg:text-2xl font-semibold p-2 text-center">
          <span>Manage Sub Organizations</span>
        </li>
      </ul>

      {/* Content */}
      {subOrgs.length === 0 ? (
        <div className="flex justify-center items-center text-gray-500 h-20">
          <div>No Sub Organizations Found</div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 capitalize mb-5">
          {subOrgs.map((subOrg) => (
            <div
              key={subOrg.org_id}
              className="flex justify-between items-center bg-gray-700 p-4 rounded-md shadow-lg transition-all hover:bg-gray-600"
            >
              <div className="flex items-center">
                <div className="ml-4">
                  <div className="text-lg lg:text-xl font-bold text-green-400">
                    {subOrg.nameEn}
                  </div>
                  <div className="text-sm text-gray-400">{subOrg.org_id}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Sub Org Button */}
      <div className="mt-4 flex justify-center">
        <Link
          href={`/org/${params.org_id}/create-sub-org`}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md shadow-md text-center transition-transform transform hover:scale-105"
        >
          Create Sub Organization
        </Link>
      </div>
    </div>
  );
}

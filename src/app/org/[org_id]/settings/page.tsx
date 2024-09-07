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
    <div className="p-4 w-full">
      <ul className="flex items-center gap-2 border-b border-gray-700 w-full">
        <li className="border-b border-blue-500 flex items-center gap-1 lg:gap-2 text-sm lg:text-lg font-semibold p-1 lg:p-2">
          <span>Manage Sub Organizations</span>
        </li>
      </ul>
      {subOrgs.length === 0 ? (
        <div className="flex justify-center items-center text-gray-500">
          <div>No Sub Organizations</div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 gap-4 p-4">
          {subOrgs.map((subOrg) => (
            <div
              key={subOrg.org_id}
              className="flex justify-between items-center bg-gray-700 p-4 rounded-md"
            >
              <div className="flex items-center text-green-400">
                {/* <UserCircleIcon className="w-6 lg:w-8 " /> */}
                <div className="ml-4">
                  <div className="font-semibold lg:font-extrabold lg:text-lg">
                    {subOrg.nameEn}
                  </div>
                  <div className="text-sm">{subOrg.org_id}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Link
        href={`/org/${params.org_id}/create-sub-org`}
        className="p-4 bg-green-600 hover:bg-green-800 rounded-md text-center m-4"
      >
        Create Sub Org
      </Link>
    </div>
  );
}

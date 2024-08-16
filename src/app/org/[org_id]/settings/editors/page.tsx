import { prisma } from "@/lib/prisma";
import Link from "next/link";

const getOrgEditors = async (org_id: string) => {
  const editors = await prisma.editor.findMany({
    where: {
      org_id: org_id,
    },
  });
  return editors;
};

export default async function OrgSettingsEditorsPage({
  params,
}: {
  params: { org_id: string };
}) {
  const editors = await getOrgEditors(params.org_id);
  return (
    <>
      <div className="bg-gray-900 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-semibold">Manage access</h1>
          <div className="flex space-x-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md">
              Add people
            </button>
          </div>
        </div>

        <div className="mb-4">
          <ul className="flex space-x-6 text-white border-b border-gray-700">
            <li className="pb-2 border-b-2 border-blue-500">Editors</li>
            <li className="pb-2">Invitations</li>
          </ul>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center pb-4 border-b border-gray-700">
            <input
              type="text"
              placeholder="Find people or a team..."
              className="bg-gray-700 text-white px-4 py-2 rounded-md w-full ml-4"
            />
          </div>
          <div className="mt-4">
            {[
              { name: "Oxyborg", role: "admin" },
              { name: "khalil", role: "admin" },
              { name: "sabrinahz", role: "write" },
            ].map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg mb-4"
              >
                <div className="flex items-center">
                  <span className="ml-4 text-blue-400 font-bold">
                    {user.name}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="bg-gray-600 text-white px-4 py-2 rounded-md">
                    Role: {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

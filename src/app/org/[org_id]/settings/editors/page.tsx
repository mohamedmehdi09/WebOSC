import AddEditorModal from "@/components/AddEditorModal";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const getOrgEditors = async (org_id: string) => {
  const editors = await prisma.editor.findMany({
    where: {
      org_id: org_id,
    },
    include: { user: true },
  });
  return editors;
};

const getUsers = async (org_id: string) => {
  const users = await prisma.user.findMany({
    include: { editors: { where: { org_id: org_id } } },
  });
  return users;
};

export default async function OrgSettingsEditorsPage({
  params,
}: {
  params: { org_id: string };
}) {
  const editors = await getOrgEditors(params.org_id);
  const users = await getUsers(params.org_id);
  return (
    <>
      <div className="bg-gray-900 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-semibold">Manage access</h1>
          <div className="flex">
            <AddEditorModal org_id={params.org_id} users={users} />
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
            {editors.map((editor, index) => (
              <div
                key={editor.editor_id}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg mb-4"
              >
                <div className="flex items-center">
                  <span className="ml-4 text-blue-400 font-bold">
                    {editor.user.name}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="bg-gray-600 text-white px-4 py-2 rounded-md">
                    Role: unknown
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

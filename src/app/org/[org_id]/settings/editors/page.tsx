import AddEditorModal from "@/components/AddEditorModal";
import { prisma } from "@/lib/prisma";
import { UserCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
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
      <div className="bg-gray-900 p-6 w-full flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">Manage access</h1>
          <AddEditorModal org_id={params.org_id} users={users} />
        </div>

        <div>
          <ul className="flex space-x-6 text-white border-b border-gray-700">
            <li className="pb-2 border-b-2 border-blue-500">Editors</li>
            <li className="pb-2">Invitations</li>
          </ul>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex gap-4 pb-4 border-b border-gray-700">
            <MagnifyingGlassIcon className="w-6" />
            <input
              type="text"
              placeholder="Find Editors..."
              className="bg-inherit focus:outline-none text-white py-2 rounded-md w-full"
            />
          </div>
          <div className="flex flex-col gap-2 p-2">
            {editors.map((editor, index) => (
              <div
                key={editor.editor_id}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex items-center">
                  <UserCircleIcon className="w-8" />
                  <span className="ml-4 text-blue-400 font-bold">
                    {editor.user.name} {editor.user.lastname}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="bg-gray-600 text-white px-4 py-2 rounded-md">
                    Role
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

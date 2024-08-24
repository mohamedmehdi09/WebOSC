import AddEditorModal from "@/components/AddEditorModal";
import RemoveEditor from "@/components/RemoveEditor";
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

const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      lastname: true,
      user_id: true,
      middlename: true,
      email: true,
      isMale: true,
    },
  });
  return users;
};

export default async function OrgSettingsEditorsPage({
  params,
}: {
  params: { org_id: string };
}) {
  const editors = await getOrgEditors(params.org_id);
  const users = await getUsers();
  return (
    <>
      <div className="bg-gray-800 p-4 md:p-6 w-full flex flex-col gap-4 border border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-semibold">Manage access</h1>
          <AddEditorModal org_id={params.org_id} users={users} />
        </div>
        <ul className="flex space-x-4 md:space-x-6 text-white border-b border-gray-700">
          <li className="pb-2 border-b-2 border-blue-500">Editors</li>
          <li className="pb-2">Invitations</li>
        </ul>

        <div className="flex flex-col gap-2 bg-gray-800 px-2 rounded-lg">
          <div className="flex gap-2 md:gap-4 pb-4 border-b border-gray-700">
            <MagnifyingGlassIcon className="w-5 md:w-6" />
            <input
              type="text"
              placeholder="Find Editors..."
              className="bg-inherit focus:outline-none text-white py-2 rounded-md w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            {editors.map((editor) => (
              <div
                key={editor.editor_id}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex items-center">
                  <UserCircleIcon className="w-6 md:w-8" />
                  <span className="ml-4 text-blue-400 font-bold">
                    {editor.user.name} {editor.user.lastname}
                  </span>
                </div>
                <div className="mt-2 md:mt-0">
                  <RemoveEditor editor_id={editor.editor_id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

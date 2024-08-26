import AddEditorModal from "@/components/AddEditorModal";
import RemoveEditor from "@/components/RemoveEditor";
import { prisma } from "@/lib/prisma";
import { UserCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { User } from "@prisma/client";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import Link from "next/link";

const getOrgEditors = async (org_id: string) => {
  const editors = await prisma.editor.findMany({
    where: {
      org_id: org_id,
      status: "active",
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
      super: true,
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
  const token = cookies().get("token")?.value;
  if (!token) return;
  const currentUser = decode(token) as Omit<User, "password">;
  return (
<>
  <div className="bg-gray-800 p-6 w-full flex flex-col gap-6 rounded-lg shadow-xl border border-gray-700">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">Manage Access</h1>
      <AddEditorModal org_id={params.org_id} users={users} />
    </div>
    
    <ul className="flex space-x-6 text-gray-300 border-b border-gray-600">
      <li className="pb-2 border-b-2 border-blue-500 text-white cursor-pointer">Editors</li>
      <li className="pb-2 cursor-pointer hover:text-white transition-colors duration-200">Invitations</li>
    </ul>

    <div className="flex flex-col gap-4 bg-gray-700 p-4 rounded-lg">
      <div className="flex gap-4 items-center pb-4 border-b border-gray-600">
        <MagnifyingGlassIcon className="w-6 text-gray-400" />
        <input
          type="text"
          placeholder="Find Editors.."
          className="bg-gray-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-shadow duration-200"
        />
      </div>

      <div className="flex flex-col gap-3">
        {editors.map((editor) => (
    <div
    key={editor.editor_id}
    className="flex justify-between items-center bg-gray-700 p-5 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200"
  >
    <div className="flex items-center">
      <UserCircleIcon className="w-10 h-10 text-green-500" />
      <span className="ml-4 text-white font-bold text-lg capitalize">
        {editor.user.name} {editor.user.lastname}
      </span>
    </div>
    <div className="mt-2 md:mt-0 flex items-center">
      {editor.user_id === currentUser.user_id ? (
        <div className="bg-green-500 px-4 py-2 rounded-full text-sm text-white font-medium">
          You
        </div>
      ) : (
        <RemoveEditor editor_id={editor.editor_id} />
      )}
    </div>
  </div>        ))}
      </div>
    </div>
  </div>
</>

  );
}

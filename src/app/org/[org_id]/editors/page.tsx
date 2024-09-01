import { prisma } from "@/lib/prisma";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const getOrgEditors = async (org_id: string) => {
  const editors = await prisma.editor.findMany({
    where: {
      org_id: org_id,
      status: "active",
    },
    include: {
      user: true,
      _count: {
        select: { announcements: true },
      },
    },
  });
  return editors;
};

export default async function OrgEditorsPage({
  params,
}: {
  params: { org_id: string };
}) {
  const editors = await getOrgEditors(params.org_id);
  return editors.length === 0 ? (
    <div className="flex justify-center items-center text-gray-500">
      <div>No Editors In This Organization</div>
    </div>
  ) : (
    <div className="flex flex-col flex-1 gap-4 px-4 md:px-24">
      <ul className="flex flex-wrap items-center gap-4 text-white border-b border-gray-700">
        <li className="border-b-2 border-blue-500 flex items-center gap-2 text-lg font-semibold p-2">
          <span>Editors</span>
          <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-sm">
            {editors.length}
          </span>
        </li>
      </ul>
      {editors.map((editor) => (
        <div
          key={editor.editor_id}
          className="flex justify-between items-center bg-gray-700 p-4 rounded-md"
        >
          <div className="flex items-center">
            <UserCircleIcon className="w-8 h-8 text-green-400" />
            <div className="ml-4">
              <div className="text-green-400 font-extrabold text-lg">
                {editor.user.name} {editor.user.lastname}
              </div>
              <Link
                href={`/u/${editor.user.user_id}`}
                className="text-gray-400 text-sm hover:underline"
              >
                @{editor.user.user_id}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-gray-600 text-white px-4 py-2 rounded-md">
              {editor._count.announcements}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

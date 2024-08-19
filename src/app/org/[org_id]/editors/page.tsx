import { prisma } from "@/lib/prisma";
import { UserIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const getOrgEditors = async (org_id: string) => {
  const editors = await prisma.editor.findMany({
    where: {
      org_id: org_id,
    },
    include: {
      user: true,
      _count: {
        select: { Announcement: true },
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
  return editors.length == 0 ? (
    <>
      <div>no Editors in this Organization</div>
    </>
  ) : (
    <>
      <div className="flex flex-1 flex-col gap-4 w-full">
        <ul className="flex space-x-6 text-white border-b border-gray-700">
          <li className="pb-2 border-b-2 border-blue-500 flex gap-2">
            <span>Editors</span>
            <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-sm">
              {editors.length}
            </span>
          </li>
        </ul>
        {editors.map((editor, index) => (
          <div
            key={editor.editor_id}
            className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
          >
            <div className="flex items-center">
              <UserCircleIcon className="w-8" />
              <div className="ml-4">
                <div className="text-blue-400 font-extrabold">
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
                {editor._count.Announcement}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

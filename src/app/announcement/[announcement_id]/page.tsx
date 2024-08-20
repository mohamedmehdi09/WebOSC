import CopyToClipboardButton from "@/components/CopyToClipboardButton";
import { prisma } from "@/lib/prisma";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const getAnnouncement = async (announcement_id: number) => {
  const announcement = await prisma.announcement.findUniqueOrThrow({
    where: { announcement_id },
    include: {
      editor: {
        include: {
          user: {
            select: {
              name: true,
              lastname: true,
              middlename: true,
              user_id: true,
            },
          },
          org: true,
        },
      },
    },
  });
  return announcement;
};

export default async function PostPage({
  params,
}: {
  params: { announcement_id: string };
}) {
  const announcement_id = Number(params.announcement_id);
  const announcement = await getAnnouncement(announcement_id);
  return (
    <div className="flex flex-col flex-1 gap-4 rounded-md m-24 p-5 bg-gradient-to-b from-slate-700 to-slate-800 relative">
      <div className="flex flex-col gap-4">
        <span className="text-4xl font-bold">{announcement.title}</span>
        <div className="flex gap-4 text-gray-400">
          <Link
            href={`/org/${announcement.editor.org_id}/posts`}
            className="hover:underline hover:text-gray-100"
          >
            {announcement.editor.org.nameEn}
          </Link>
          <span className="text-white font-bold">/</span>
          <Link
            href={`/u/${announcement.editor.user_id}`}
            className="hover:underline hover:text-gray-100"
          >
            {announcement.editor.user.name} {announcement.editor.user.lastname}
          </Link>
        </div>
      </div>
      <div className="flex-1 rounded-md text-2xl font-semibold">
        {announcement.body}
      </div>
      <div className="absolute top-3 right-3 flex gap-2">
        <Link
          href={"/"}
          title="go back home"
          className="p-2 rounded-md bg-gray-800 group"
        >
          <ArrowLeftIcon className="w-6 group-hover:-translate-x-1 transition-transform duration-200" />
        </Link>
        <CopyToClipboardButton text={`/announcement/${announcement_id}`} />
      </div>
    </div>
  );
}

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
    <div className="relative flex flex-col flex-1 gap-6 rounded-lg m-4 md:m-12 p-6 md:p-10 bg-gradient-to-b from-slate-700 to-slate-800 shadow-lg">
      {/* Top-right action buttons */}
      <div className="absolute top-4 right-4 flex items-center space-x-3">
        <Link
          href="/"
          title="Go back home"
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-6 h-6 text-white" />
        </Link>
        <CopyToClipboardButton />
      </div>

      {/* Announcement Title */}
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
          {announcement.title}
        </h1>
        <div className="flex flex-wrap gap-2 md:gap-4 text-gray-400">
          <Link
            href={`/org/${announcement.editor.org_id}/posts`}
            className="hover:underline hover:text-gray-200"
          >
            {announcement.editor.org.nameEn}
          </Link>
          <span className="text-white font-bold">/</span>
          <Link
            href={`/u/${announcement.editor.user_id}`}
            className="hover:underline hover:text-gray-200"
          >
            {announcement.editor.user.name} {announcement.editor.user.lastname}
          </Link>
        </div>
      </div>

      {/* Announcement Body */}
      <textarea
        readOnly
        className="flex-1 rounded-lg p-4 md:p-6 text-lg md:text-2xl bg-transparent outline-none cursor-default resize-none text-white leading-relaxed"
      >
        {announcement.body}
      </textarea>
    </div>
  );
}

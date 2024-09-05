import CopyToClipboardButton from "@/components/CopyToClipboardButton";
import TimeDisplayComponent from "@/components/TimeDisplayComponent";
import { checkOrgPrivilage } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/solid";
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
        },
      },
      org: true,
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
  const isEdior = await checkOrgPrivilage(announcement.org_id);

  if (announcement.publishes_at > new Date() && !isEdior) throw Error();

  if (announcement.ends_at < new Date() && !isEdior)
    return <>announcement archived</>;

  return (
    <div className="relative flex flex-col flex-1 gap-6 rounded-lg m-4 lg:m-12 p-6 lg:p-10 bg-gradient-to-b from-slate-700 to-slate-800 shadow-lg">
      {/* Top-right action buttons */}
      <div className="lg:absolute w-full justify-end top-4 right-4 flex items-center space-x-3">
        <Link
          href="/"
          title="Go back home"
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </Link>
        <CopyToClipboardButton />
        {isEdior && (
          <Link
            className="p-2 rounded-md bg-gray-800 text-gray-400 hover:text-white focus:ring-2 focus:ring-gray-500"
            href={`/announcement/${announcement.announcement_id}/edit`}
          >
            <PencilIcon className="w-6 h-6" />
          </Link>
        )}
      </div>

      {/* Announcement Title */}
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
          {announcement.title}
        </h1>
        <div className="flex flex-wrap text-xl">
          <TimeDisplayComponent date={announcement.publishes_at} />
        </div>
        <div className="flex flex-wrap gap-2 lg:gap-4 text-gray-400">
          <Link
            href={`/org/${announcement.org_id}/posts`}
            className="hover:underline hover:text-gray-200"
            title={announcement.org_id}
          >
            {announcement.org.nameEn}
          </Link>
          <span className="text-white font-bold">/</span>
          <Link
            href={`/u/${announcement.editor.user_id}`}
            className="hover:underline hover:text-gray-200"
            title={announcement.editor.user_id}
          >
            {announcement.editor.user.name}{" "}
            {announcement.editor.user.middlename &&
              announcement.editor.user.middlename + " "}
            {announcement.editor.user.lastname}
          </Link>
        </div>
      </div>

      {/* Announcement Body */}
      <pre className="rounded-lg p-4 lg:p-6 text-md lg:text-2xl bg-transparent cursor-default text-wrap">
        {announcement.body}
      </pre>
    </div>
  );
}

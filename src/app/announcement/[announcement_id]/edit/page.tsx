import UpdateAnnouncementEndsPublishingDateForm from "@/components/UpdateAnnouncementEndPublishingForm";
import UpdateAnnouncementPublishDateForm from "@/components/UpdateAnnouncementPublishDateForm";
import { checkOrgPrivilage } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const getAnnouncement = async (announcement_id: number) => {
  return await prisma.announcement.findUniqueOrThrow({
    where: { announcement_id },
    include: {
      editor: true,
      org: true,
    },
  });
};

export default async function EditAnnouncementPage({
  params,
}: {
  params: { announcement_id: number };
}) {
  const announcement_id = Number(params.announcement_id);
  const announcement = await getAnnouncement(announcement_id);
  const isEditor = await checkOrgPrivilage(announcement.org_id);

  if (!isEditor)
    return (
      <div className="text-center text-red-500">
        You are not allowed to edit this announcement.
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row flex-1 gap-6 px-4 md:px-24 py-8">
      <div className="flex flex-col flex-1 gap-4 px-6 py-4 rounded-lg  bg-gradient-to-b from-slate-700 to-slate-800 shadow-lg">
        {/* Announcement Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            {announcement.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-gray-400">
            <Link
              href={`/org/${announcement.org_id}/posts`}
              className="hover:underline hover:text-gray-200"
              title={announcement.org_id}
            >
              {announcement.org_id}
            </Link>
            <span className="text-white font-bold">/</span>
            <Link
              href={`/u/${announcement.editor.user_id}`}
              className="hover:underline hover:text-gray-200"
              title={announcement.editor.user_id}
            >
              {announcement.editor.user_id}
            </Link>
          </div>
        </div>

        {/* Announcement Body */}
        <div className="flex-1 rounded-lg p-4 md:p-6 text-lg md:text-xl text-white whitespace-pre-wrap break-words">
          {announcement.body}
        </div>
      </div>
      <div className="md:w-1/3 h-fit flex flex-col gap-2 md:gap-4 p-4 rounded-md bg-gray-700 md:text-xl">
        <div className="flex flex-col gap-1 max-w-lg">
          <span className="text-lg font-semibold">Created At:</span>
          <span className="w-full p-3 rounded-md bg-gray-900">
            {announcement.created_at.toLocaleDateString("en-UK", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
        </div>
        <div className="flex flex-col gap-1 max-w-lg">
          <span className="text-lg font-semibold">Updated At:</span>
          <span className="w-full p-3 rounded-md bg-gray-900">
            {announcement.updated_at.toLocaleDateString("en-UK", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
        </div>

        <div className="flex flex-col gap-4 pt-2">
          <UpdateAnnouncementPublishDateForm
            announcement_id={announcement.announcement_id}
            publishes_at={announcement.publishes_at}
          />
          <UpdateAnnouncementEndsPublishingDateForm
            announcement_id={announcement.announcement_id}
            ends_at={announcement.ends_at}
          />
        </div>
      </div>
    </div>
  );
}

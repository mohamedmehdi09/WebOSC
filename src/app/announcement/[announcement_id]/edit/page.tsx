import UpdateAnnouncementEndsPublishingDateForm from "@/components/UpdateAnnouncementEndPublishingForm";
import UpdateAnnouncementPublishDateForm from "@/components/UpdateAnnouncementPublishDateForm";
import { checkOrgPrivilage } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const getAnnouncement = async (announcement_id: number) => {
  const announcement = await prisma.announcement.findUniqueOrThrow({
    where: { announcement_id },
    include: {
      editor: true,
      org: true,
    },
  });
  return announcement;
};
export default async function EditAnnouncementPage({
  params,
}: {
  params: { announcement_id: number };
}) {
  const announcement_id = Number(params.announcement_id);
  const announcement = await getAnnouncement(announcement_id);
  const isEdior = await checkOrgPrivilage(announcement.org_id);

  if (!isEdior) return "not allowed";

  return (
    <div className="flex flex-col flex-1 gap-6 rounded-lg m-4 md:m-12 p-6 md:p-10 bg-gradient-to-b from-slate-700 to-slate-800 shadow-lg">
      {/* Announcement Title */}
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
          {announcement.title}
        </h1>
        <div className="flex flex-wrap gap-2 md:gap-4 text-gray-400">
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
        <div className="flex flex-col gap-2 md:gap-4 text-base md:text-xl">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">Created At:</span>
            {announcement.created_at
              ? announcement.created_at.toLocaleDateString("en-UK", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              : "not spacified"}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">Updated At:</span>
            {announcement.updated_at
              ? announcement.updated_at.toLocaleDateString("en-UK", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              : "not spacified"}
          </div>
          <UpdateAnnouncementPublishDateForm
            announcement_id={announcement.announcement_id}
            publishes_at={announcement.publishes_at}
          />

          <UpdateAnnouncementEndsPublishingDateForm
            ends_at={announcement.ends_at}
            announcement_id={announcement.announcement_id}
          />
        </div>
      </div>

      {/* Announcement Body */}
      <pre className="flex-1 rounded-lg p-4 md:p-6 text-lg md:text-2xl bg-transparent outline-none cursor-default whitespace-pre-wrap break-words">
        {announcement.body}
      </pre>
    </div>
  );
}

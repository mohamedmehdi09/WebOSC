import TimeDisplayComponent from "@/components/TimeDisplayComponent";
import UpdateAnnouncementEndsPublishingDateForm from "@/components/UpdateAnnouncementEndPublishingForm";
import UpdateAnnouncementPublishDateForm from "@/components/UpdateAnnouncementPublishDateForm";
import UpdateAnnouncementTitleForm from "@/components/UpdateAnnouncementTitleForm";
import { checkOrgPrivilage } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { title } from "process";

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
    <div className="flex flex-col lg:flex-row flex-1 gap-6 px-4 lg:px-24 py-8">
      <div className="flex flex-col flex-1 gap-4 px-6 py-4 rounded-lg  bg-gradient-to-b from-slate-700 to-slate-800 shadow-lg">
        <div className="flex flex-col gap-4">
          <UpdateAnnouncementTitleForm
            title={announcement.title}
            announcement_id={announcement_id}
          />

          <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-gray-400">
            <Link
              href={`/org/${announcement.org_id}/posts`}
              className="hover:underline hover:text-gray-200"
              title={announcement.org_id}
            >
              {announcement.org_id}
            </Link>
            <span className="font-bold">/</span>
            <Link
              href={`/u/${announcement.editor.user_id}`}
              className="hover:underline hover:text-gray-200"
              title={announcement.editor.user_id}
            >
              {announcement.editor.user_id}
            </Link>
          </div>
        </div>
        <div className="flex-1 rounded-lg p-4 lg:p-6 text-lg lg:text-xl whitespace-pre-wrap break-words">
          {announcement.body}
        </div>
      </div>
      <div className="lg:w-1/3 h-fit flex flex-col gap-2 lg:gap-4 p-4 rounded-md bg-gray-700 lg:text-xl">
        <div className="flex flex-col gap-1 max-w-lg">
          <span className="text-lg font-semibold">Created At:</span>
          <span className="w-full p-3 rounded-md bg-gray-900">
            <TimeDisplayComponent date={announcement.created_at} />
          </span>
        </div>
        <div className="flex flex-col gap-1 max-w-lg">
          <span className="text-lg font-semibold">Updated At:</span>
          <span className="w-full p-3 rounded-md bg-gray-900">
            <TimeDisplayComponent date={announcement.updated_at} />
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

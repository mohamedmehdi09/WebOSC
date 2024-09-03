import { checkOrgPrivilage } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { EyeIcon, PencilIcon } from "@heroicons/react/20/solid";
import { Announcement, Editor } from "@prisma/client";
import Link from "next/link";

const getOrgAnnouncements = async (org_id: string) => {
  const announcements = await prisma.announcement.findMany({
    orderBy: { announcement_id: "desc" },
    where: {
      org_id: org_id,
    },
    include: {
      editor: true,
    },
  });
  const currentDate = new Date();

  const publishedAnnouncements = announcements.filter(
    (a) =>
      a.publishes_at &&
      a.publishes_at < currentDate &&
      (!a.ends_at || a.ends_at < currentDate),
  );
  const publishingAnnouncements = announcements.filter(
    (a) =>
      a.publishes_at &&
      a.publishes_at < currentDate &&
      (!a.ends_at || a.ends_at > currentDate),
  );
  const plannedAnnouncements = announcements.filter(
    (a) => a.publishes_at && a.publishes_at > currentDate,
  );

  return {
    published: publishedAnnouncements,
    publishing: publishingAnnouncements,
    planned: plannedAnnouncements,
  };
};

export default async function OrgPostsPage({
  params,
}: {
  params: { org_id: string };
}) {
  const { published, publishing, planned } = await getOrgAnnouncements(
    params.org_id,
  );
  const isEditor = await checkOrgPrivilage(params.org_id);
  return (
    <div className="flex flex-col flex-1 gap-4 w-full px-4 md:px-24">
      <ul className="flex flex-wrap items-center gap-4 text-white border-b border-gray-700">
        <li className="border-b-2 border-blue-500 flex items-center gap-2 text-lg font-semibold p-2">
          <span>Announcements</span>
          <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-sm">
            {publishing.length}
          </span>
        </li>
      </ul>
      {publishing.length === 0 ? (
        <p className="text-gray-500 pb-4 pt-3">No announcements created!</p>
      ) : (
        <div className="w-full">
          {publishing.map((announcement) => (
            <AnnouncementCard
              key={announcement.announcement_id}
              announcement={announcement}
              isEditor={isEditor}
            />
          ))}
        </div>
      )}

      {isEditor && (
        <>
          <ul className="flex flex-wrap items-center gap-4 text-white border-b border-gray-700">
            <li className="border-b-2 border-blue-500 flex items-center gap-2 text-lg font-semibold p-2">
              <span>Planned</span>
              <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-sm">
                {planned.length}
              </span>
            </li>
          </ul>
          {planned.length === 0 ? (
            <p className="text-gray-500 pb-4 pt-3">No announcements created!</p>
          ) : (
            <div className="w-full">
              {planned.map((announcement) => (
                <AnnouncementCard
                  key={announcement.announcement_id}
                  announcement={announcement}
                  isEditor={isEditor}
                />
              ))}
            </div>
          )}
          <ul className="flex flex-wrap items-center gap-4 text-white border-b border-gray-700">
            <li className="border-b-2 border-blue-500 flex items-center gap-2 text-lg font-semibold p-2">
              <span>Archived</span>
              <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-sm">
                {published.length}
              </span>
            </li>
          </ul>
          {published.length === 0 ? (
            <p className="text-gray-500 pb-4 pt-3">No announcements created!</p>
          ) : (
            <div className="w-full">
              {published.map((announcement) => (
                <AnnouncementCard
                  key={announcement.announcement_id}
                  announcement={announcement}
                  isEditor={isEditor}
                />
              ))}
            </div>
          )}
        </>
      )}
      {isEditor && (
        <Link
          href={`/org/${params.org_id}/posts/create`}
          className="bg-green-600 text-white rounded p-3 md:p-4 mb-4 text-center hover:bg-blue-700 transition"
        >
          Add Announcement
        </Link>
      )}
    </div>
  );
}

const AnnouncementCard = ({
  announcement,
  isEditor,
}: {
  announcement: Announcement & {
    editor: Editor;
  };
  isEditor: boolean;
}) => {
  return (
    <div
      key={announcement.announcement_id}
      className="bg-gray-700 rounded p-4 md:p-5 shadow-lg w-full mb-4 flex justify-between items-start md:items-center"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-xl md:text-2xl font-semibold">
          {announcement.title}
        </h3>
        <h3 className="text-lg md:text-xl">
          {announcement.publishes_at.toLocaleDateString("en-UK", {
            minute: "numeric",
            hour: "numeric",
          })}
        </h3>
        <Link
          href={`/u/${announcement.editor.user_id}`}
          className="text-gray-400 hover:underline"
        >
          @{announcement.editor.user_id}
        </Link>
      </div>

      <div className="flex gap-4 justify-center items-center h-full">
        {isEditor && (
          <Link
            href={`/announcement/${announcement.announcement_id}/edit`}
            className="p-2 bg-gray-800 rounded-md flex-shrink-0 group"
            title="Edit Announcement"
          >
            <PencilIcon className="w-6 h-6 text-gray-400 group-hover:text-white" />
          </Link>
        )}

        <Link
          href={`/announcement/${announcement.announcement_id}`}
          className="p-2 bg-gray-800 rounded-md flex-shrink-0 group"
        >
          <EyeIcon className="w-6 h-6 text-gray-400 group-hover:text-white" />
        </Link>
      </div>
    </div>
  );
};

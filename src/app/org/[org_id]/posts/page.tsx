import { checkOrgPrivilage } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { EyeIcon } from "@heroicons/react/20/solid";
import { Announcement, Editor } from "@prisma/client";
import Link from "next/link";

const getOrgAnnouncements = async (org_id: string) => {
  const announcements = await prisma.announcement.findMany({
    where: {
      editor: {
        org_id: org_id,
      },
    },
    include: {
      editor: { include: { user: { select: { name: true, lastname: true } } } },
    },
  });
  return announcements;
};

export default async function OrgPostsPage({
  params,
}: {
  params: { org_id: string };
}) {
  const announcements = await getOrgAnnouncements(params.org_id);
  const isEditor = await checkOrgPrivilage(params.org_id);
  return (
    <div className="flex flex-col flex-1 gap-4 w-full p-4 md:p-6 items-center">
      {announcements.length === 0 ? (
        <p className="text-gray-500">No announcements created</p>
      ) : (
        <div className="w-full max-w-4xl">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.announcement_id}
              org_id={params.org_id}
              announcement={announcement}
            />
          ))}
        </div>
      )}
      {isEditor && (
        <Link
          href={`/org/${params.org_id}/posts/create`}
          className="bg-blue-500 text-white rounded p-3 md:p-4 mb-4 text-center hover:bg-blue-600 transition"
        >
          Add Announcement
        </Link>
      )}
    </div>
  );
}

const AnnouncementCard = ({
  announcement,
  org_id,
}: {
  announcement: Announcement & {
    editor: Editor & { user: { name: string; lastname: string } };
  };
  org_id: string;
}) => {
  return (
    <div
      key={announcement.announcement_id}
      className="bg-gray-700 rounded p-4 md:p-5 shadow-lg w-full mb-4 flex justify-between items-start md:items-center"
    >
      <div className="flex-1 mb-2 md:mb-0">
        <h3 className="text-xl md:text-2xl font-semibold text-white">
          {announcement.title}
        </h3>
        <p className="text-gray-400 mt-1">
          <span className="text-gray-300">By</span>
          <span className="text-gray-400 hover:underline ml-1">
            @{announcement.editor.user_id}
          </span>
        </p>
      </div>
      <Link
        href={`/announcement/${announcement.announcement_id}`}
        className="p-2 bg-gray-800 rounded-md flex-shrink-0"
      >
        <EyeIcon className="w-6 h-6 text-gray-400" />
      </Link>
    </div>
  );
};

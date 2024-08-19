import { prisma } from "@/lib/prisma";
import { Announcement, Editor, User } from "@prisma/client";
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
  return (
    <div className="flex flex-col flex-1 gap-3 w-full p-2 items-center">
      {announcements.length == 0 ? (
        <>no announcements created</>
      ) : (
        <>
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.announcement_id}
              org_id={params.org_id}
              announcement={announcement}
            />
          ))}
        </>
      )}
      <Link
        href={"/org/" + params.org_id + "/posts/create"}
        className="bg-blue-500 text-white rounded p-4"
      >
        add announcement
      </Link>
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
      // href={`/org/${org_id}/posts/${announcement.announcement_id}`}
      key={announcement.announcement_id}
      className="bg-gray-700 rounded p-5 shadow-lg w-full flex flex-col items-start"
    >
      <h3 className="text-2xl">{announcement.title}</h3>
      <p className="flex gap-2">
        <span className="">By</span>
        <span className="text-gray-400 hover:underline">
          @{announcement.editor.user_id}
        </span>
      </p>
    </div>
  );
};

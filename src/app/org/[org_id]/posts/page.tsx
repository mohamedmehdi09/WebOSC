import { prisma } from "@/lib/prisma";
import Link from "next/link";

const getOrgAnnouncements = async (org_id: string) => {
  const announcements = await prisma.announcement.findMany({
    where: {
      org_id: org_id,
    },
  });
  return announcements;
};

export default async function Posts({
  params,
}: {
  params: { org_id: string };
}) {
  const announcements = await getOrgAnnouncements(params.org_id);
  return announcements.length == 0 ? (
    <>
      <div className="flex flex-1">no announcements created</div>
    </>
  ) : (
    <>
      {announcements.map((announcement) => (
        <Link
          href={`/org/${params.org_id}/posts/${announcement.announcement_id}`}
          key={announcement.announcement_id}
          className="bg-red-200 rounded p-5 shadow-lg w-1/2 text-center"
        >
          {announcement.title}
        </Link>
      ))}
    </>
  );
}

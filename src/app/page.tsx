"use server";

import { logout } from "@/lib/actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Announcement, Editor, Organization } from "@prisma/client";
import { cookies } from "next/headers";
import { BellIcon } from "@heroicons/react/20/solid";

const getOrgAnnouncements = async () => {
  const announcements = await prisma.announcement.findMany({
    include: {
      editor: {
        include: {
          user: { select: { name: true, middlename: true, lastname: true } },
          org: true,
        },
      },
    },
  });
  return announcements;
};

export default async function RootPage() {
  const announcements = await getOrgAnnouncements();
  return (
    <>
      <div className="flex flex-1 w-full">
        <nav className="bg-black w-1/5 flex border-r border-gray-500 relative text-center font-semibold p-2">
          <Link
            href={"/org"}
            className="bg-blue-700 hover:bg-blue-500 rounded-md px-4 py-3 w-full h-fit"
          >
            Browse Orgainzations
          </Link>
          {cookies().get("token") ? (
            <>
              <form
                className="absolute bottom-2 right-2 left-2"
                action={logout}
              >
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 w-full rounded-md px-4 py-3"
                >
                  logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href={"/login"}
              className="absolute bottom-2 right-2 left-2 p-2 rounded-md bg-green-700 hover:bg-green-800"
            >
              Log In
            </Link>
          )}
        </nav>
        <div className="flex flex-col flex-1 gap-3 w-full p-2 items-center">
          <ul className="flex w-full border-b border-gray-700 font-bold text-2xl">
            <li className="pb-2 border-b-2 border-blue-500 px-4">Posts</li>
          </ul>
          {announcements.length == 0 ? (
            <>no announcements created</>
          ) : (
            <>
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.announcement_id}
                  announcement={announcement}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

const AnnouncementCard = ({
  announcement,
}: {
  announcement: Announcement & {
    editor: Editor & {
      user: { name: string; lastname: string };
      org: Organization;
    };
  };
}) => {
  return (
    <div
      key={announcement.announcement_id}
      className="bg-slate-800 rounded-md p-5 shadow-lg w-full flex flex-col gap-4 items-start"
    >
      <h3 className="text-2xl font-bold flex items-center gap-2">
        <BellIcon className="w-6" />
        <span>{announcement.title}</span>
      </h3>
      <div className="flex flex-col px-8 text-gray-400">
        <Link
          href={`/org/${announcement.editor.org_id}/posts`}
          className="hover:underline hover:text-gray-200 font-semibold text-lg"
        >
          {announcement.editor.org.nameEn}
        </Link>
        <span className="hover:underline">@{announcement.editor.user_id}</span>
      </div>
    </div>
  );
};

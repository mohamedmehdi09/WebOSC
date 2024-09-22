import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Announcement, Editor, Organization, User } from "@prisma/client";
import { cookies } from "next/headers";
import { decode } from "jsonwebtoken";
import { GlobeEuropeAfricaIcon } from "@heroicons/react/24/solid";
import LogoutForm from "@/components/forms/LogoutForm";
import { TokenPayload } from "@/lib/types";
import { CalendarIcon, BellIcon } from "@heroicons/react/24/outline";
import TimeDisplayComponent from "@/components/TimeDisplayComponent";

// Fetch announcements from the database

const getOrgAnnouncements = async () => {
  const currentDate = new Date();
  const announcements = await prisma.announcement.findMany({
    where: {
      publishes_at: { lte: currentDate },
      ends_at: { gt: currentDate },
    },
    orderBy: { publishes_at: "desc" },
    include: {
      editor: true,
    },
  });
  return announcements;
};

const getEditorOrgs = async () => {
  const token = cookies().get("token")?.value;
  if (!token) return [];
  const user = decode(token) as TokenPayload;
  const editors = await prisma.editor.findMany({
    where: { user_id: user.user_id, status: "active" },
    include: { org: true },
  });
  return editors;
};

// Main page component
export default async function RootPage() {
  const announcements = await getOrgAnnouncements();
  const editors = await getEditorOrgs();

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-black text-white">
      {/* Sidebar navigation */}
      <nav className="lg:w-1/5 w-full lg:min-h-screen flex flex-col gap-3 items-center lg:justify-start border-r border-gray-800 text-center font-semibold p-4 bg-black relative">
        <Link
          href="/org"
          className="bg-blue-700 hover:bg-blue-600 rounded-md px-4 py-2 w-full text-center transition-colors truncate"
        >
          Browse Organizations
        </Link>
        {cookies().get("token") ? (
          <LogoutForm />
        ) : (
          <Link
            href="/login"
            className="bg-green-700 hover:bg-green-600 rounded-md px-4 py-2 transition-colors w-full"
          >
            Log In
          </Link>
        )}
        {cookies().get("token") && (
          <>
            {editors.length > 0 && (
              <div className="font-normal flex flex-col gap-2 w-full">
                <ul className="flex w-full border-b border-gray-700 lg:text-xl mb-2 font-normal">
                  <li className="pb-2 truncate">My Organizations</li>
                </ul>
                {editors.map((editor) => (
                  <Link
                    href={`/org/${editor.org.org_id}/posts`}
                    className="bg-slate-800 p-2 text-sm rounded-md flex items-center gap-2 text-left hover:bg-slate-700 transition-colors duration-200"
                    key={editor.editor_id}
                  >
                    <GlobeEuropeAfricaIcon className="w-6 shrink-0" />
                    <span className="truncate">{editor.org.nameEn}</span>
                  </Link>
                ))}
              </div>
            )}
            {[].length > 0 && (
              <div className="font-normal flex flex-col gap-1 w-full">
                <ul className="flex w-full border-b border-gray-700 lg:text-xl mb-4 font-normal">
                  <li className="pb-2">My Subscriptions</li>
                </ul>
              </div>
            )}
          </>
        )}
      </nav>

      {/* Main content */}
      <div className="flex-1 pl-4 pr-4 lg:p-8">
        <ul className="flex w-full border-b border-gray-700 font-bold text-lg lg:text-2xl mb-4">
          <li className="pb-2 border-b-2 border-blue-500 px-4">Posts</li>
        </ul>
        {announcements.length === 0 ? (
          <p className="text-center text-gray-400">No announcements for you!</p>
        ) : (
          announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.announcement_id}
              announcement={announcement}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Announcement card component
const AnnouncementCard = ({
  announcement,
}: {
  announcement: Announcement & {
    editor: Editor;
  };
}) => {
  return (
    <Link
      href={`/announcement/${announcement.announcement_id}`}
      className="bg-gray-800 rounded-md p-4 shadow-lg mb-4 flex flex-col gap-4 hover:bg-gray-700 transition-colors"
    >
      <h3 className="text-lg lg:text-2xl font-bold flex items-center gap-2">
        <BellIcon className="w-5 lg:w-6 text-yellow-400" />
        <span>{announcement.title}</span>
      </h3>
      <h3 className="text-lg font-medium flex items-center gap-2">
        <CalendarIcon className="w-5 lg:w-6 text-yellow-400" />
        <TimeDisplayComponent date={announcement.publishes_at} />
      </h3>
      <div className="text-gray-400">
        <div className="font-semibold text-sm lg:text-base">
          {announcement.org_id}
        </div>
        <span className="text-xs lg:text-sm">
          @{announcement.editor.user_id}
        </span>
      </div>
    </Link>
  );
};

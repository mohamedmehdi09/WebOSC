import { logout } from "@/lib/actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Announcement, Editor, Organization } from "@prisma/client";
import { cookies } from "next/headers";
import { BellIcon } from "@heroicons/react/20/solid";

// Fetch announcements from the database
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

// Main page component
export default async function RootPage() {
  const announcements = await getOrgAnnouncements();

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-black text-white">
      {/* Sidebar navigation */}
      <nav className="md:w-1/5 w-full md:min-h-screen flex flex-col items-center md:justify-start border-r border-gray-800 text-center font-semibold p-4 bg-gray-900">
        <Link
          href="/org"
          className="bg-blue-700 hover:bg-blue-600 rounded-md px-4 py-2 my-2 w-full text-center transition-colors"
        >
          Browse Organizations
        </Link>
        {cookies().get("token") ? (
          <form
            className="w-full flex justify-center mt-2"
            action={logout}
          >
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-600 rounded-md px-4 py-2 w-full transition-colors"
            >
              Logout
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="bg-green-700 hover:bg-green-600 rounded-md px-4 py-2 w-full text-center mt-2 transition-colors"
          >
            Log In
          </Link>
        )}
      </nav>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8">
        <ul className="flex w-full border-b border-gray-700 font-bold text-lg md:text-2xl mb-4">
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
    editor: Editor & {
      user: { name: string; lastname: string };
      org: Organization;
    };
  };
}) => {
  return (
    <Link
      href={`/announcement/${announcement.announcement_id}`}
      className="bg-gray-800 rounded-md p-4 shadow-lg mb-4 flex flex-col gap-4 hover:bg-gray-700 transition-colors"
    >
      <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
        <BellIcon className="w-5 md:w-6 text-yellow-400" />
        <span>{announcement.title}</span>
      </h3>
      <div className="text-gray-400">
        <div className="font-semibold text-sm md:text-base">
          {announcement.editor.org.nameEn}
        </div>
        <span className="text-xs">@{announcement.editor.user_id}</span>
      </div>
    </Link>
  );
};

import { checkOrgPrivilage, checkSuperUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { EyeIcon, PencilIcon } from "@heroicons/react/20/solid";
import { Announcement, Editor } from "@prisma/client";
import Link from "next/link";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import TimeDisplayComponent from "@/components/TimeDisplayComponent";

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
      (!a.ends_at || a.ends_at < currentDate)
  );
  const publishingAnnouncements = announcements.filter(
    (a) =>
      a.publishes_at &&
      a.publishes_at < currentDate &&
      (!a.ends_at || a.ends_at > currentDate)
  );
  const plannedAnnouncements = announcements.filter(
    (a) => a.publishes_at && a.publishes_at > currentDate
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
    params.org_id
  );
  const isEditor = await checkOrgPrivilage(params.org_id);
  const sudo = checkSuperUser();
  return (
    <>
      <TabGroup className="flex flex-col flex-1 gap-4 w-full px-4 lg:px-24 relative">
        <TabList className="flex items-center gap-2 border-b border-gray-700">
          <Tab className="data-[selected]:border-b border-blue-500 flex items-center gap-1 lg:gap-2 text-sm lg:text-lg font-semibold data-[selected]:font-bold p-1 lg:p-2 outline-none">
            <span>Announcements</span>
            <span className="bg-gray-600 px-2 py-1 rounded-full text-xs lg:text-sm">
              {publishing.length}
            </span>
          </Tab>
          {(isEditor || sudo) && (
            <>
              <Tab className="data-[selected]:border-b border-blue-500 flex items-center gap-1 lg:gap-2 text-sm lg:text-lg font-semibold data-[selected]:font-bold  p-1 lg:p-2 outline-none">
                <span>Planned</span>
                <span className="bg-gray-600 px-2 py-1 rounded-full text-xs lg:text-sm">
                  {planned.length}
                </span>
              </Tab>
              <Tab className="data-[selected]:border-b border-blue-500 flex items-center gap-1 lg:gap-2 text-sm lg:text-lg font-semibold data-[selected]:font-bold  p-1 lg:p-2 outline-none">
                <span>Archived</span>
                <span className="bg-gray-600 px-2 py-1 rounded-full text-xs lg:text-sm">
                  {published.length}
                </span>
              </Tab>
            </>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            {publishing.length === 0 ? (
              <p className="text-gray-500 pb-4 pt-3">
                No announcements for now!
              </p>
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
          </TabPanel>
          {(isEditor || sudo) && (
            <>
              <TabPanel>
                {planned.length === 0 ? (
                  <p className="text-gray-500 pb-4 pt-3">
                    No announcements planned!
                  </p>
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
              </TabPanel>
              <TabPanel>
                {published.length === 0 ? (
                  <p className="text-gray-500 pb-4 pt-3">
                    No announcements archived!
                  </p>
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
              </TabPanel>
            </>
          )}
        </TabPanels>
        {isEditor && (
          <Link
            href={`/org/${params.org_id}/posts/create`}
            className="bg-green-600 text-white rounded px-3 lg:py-1 py-2 text-center hover:bg-green-700 transition lg:absolute top-0 right-24 flex justify-center items-center gap-2"
          >
            <PlusCircleIcon className="w-6 h-6" />
            Add Announcement
          </Link>
        )}
      </TabGroup>
    </>
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
      className="bg-gray-700 rounded p-4 lg:p-5 shadow-lg w-full mb-4 flex justify-between items-start lg:items-center"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-xl lg:text-3xl font-semibold lg:font-bold">
          {announcement.title}
        </h1>
        <h3 className="text-md lg:text-xl">
          <TimeDisplayComponent date={announcement.publishes_at} />
        </h3>
        <Link
          href={`/u/${announcement.editor.user_id}`}
          className="text-gray-400 hover:underline"
        >
          @{announcement.editor.user_id}
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-center items-center h-full">
        {isEditor && (
          <Link
            href={`/announcement/${announcement.announcement_id}/edit`}
            className="p-2 bg-gray-800 rounded-md flex-shrink-0 group"
            title="Edit Announcement"
          >
            <PencilIcon className="w-4 lg:w-6 text-gray-400 group-hover:text-white" />
          </Link>
        )}

        <Link
          href={`/announcement/${announcement.announcement_id}`}
          className="p-2 bg-gray-800 rounded-md flex-shrink-0 group"
        >
          <EyeIcon className="w-4 lg:w-6 text-gray-400 group-hover:text-white" />
        </Link>
      </div>
    </div>
  );
};

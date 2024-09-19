import AddEditorModal from "@/components/AddEditorModal";
import { prisma } from "@/lib/prisma";
import { TokenPayload } from "@/lib/types";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import SettingsEditorList from "@/components/SettingsEditorList";

const getOrgEditors = async (org_id: string) => {
  const editors = await prisma.editor.findMany({
    where: {
      org_id: org_id,
    },
    include: {
      user: {
        select: {
          user_id: true,
          name: true,
          middlename: true,
          lastname: true,
          email: true,
        },
      },
    },
  });

  const activeEditors = editors.filter((editor) => editor.status === "active");
  const suspendedEditors = editors.filter(
    (editor) => editor.status === "suspended",
  );
  return [activeEditors, suspendedEditors];
};

const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      user_id: true,
      name: true,
      lastname: true,
      middlename: true,
      email: true,
      isMale: true,
    },
    where: {
      PrimaryEmail: { emailVerified: true },
    },
  });
  return users;
};

export default async function OrgSettingsEditorsPage({
  params,
}: {
  params: { org_id: string };
}) {
  const [activeEditors, suspendedEditors] = await getOrgEditors(params.org_id);
  const users = await getUsers();
  const token = cookies().get("token")?.value;
  if (!token) return;
  const currentUser = decode(token) as TokenPayload;
  return (
    <>
      <TabGroup className="bg-gray-800 p-4 lg:p-6 w-full flex flex-col gap-4 border border-gray-700 text-sm lg:text-base">
        <div className="flex justify-between items-center">
          <h1 className="text-lg lg:text-2xl font-semibold">Manage Access</h1>
          <AddEditorModal org_id={params.org_id} users={users} />
        </div>
        <TabList className="flex gap-2 text-white border-b border-gray-700">
          <Tab className="pb-2 px-1 lg:px-2 border-b-2 border-transparent data-[selected]:border-blue-500 outline-none">
            Editors
            <span className="ml-2 bg-slate-700 px-2 py-1 rounded-full">
              {activeEditors.length}
            </span>
          </Tab>
          <Tab className="pb-2 px-2 border-b-2 border-transparent data-[selected]:border-blue-500 outline-none">
            Suspended
            <span className="ml-2 bg-slate-700 px-2 py-1 rounded-full">
              {suspendedEditors.length}
            </span>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="flex flex-col gap-2 bg-gray-800 px-1 rounded-lg">
            <SettingsEditorList
              editors={activeEditors}
              currentUser={currentUser}
            />
          </TabPanel>
          <TabPanel className="flex flex-col gap-2 bg-gray-800 px-2 rounded-lg">
            {suspendedEditors.length > 0 ? (
              <SettingsEditorList
                editors={suspendedEditors}
                currentUser={currentUser}
              />
            ) : (
              "No Suspended Editors!"
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}

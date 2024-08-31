import AddEditorModal from "@/components/AddEditorModal";
import RemoveEditor from "@/components/RemoveEditor";
import { prisma } from "@/lib/prisma";
import { TokenPayload } from "@/lib/types";
import { UserCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import ReactivateEditor from "@/components/ReactivateEditor";

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
    (editor) => editor.status === "suspended"
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
      <TabGroup className="bg-gray-800 p-4 md:p-6 w-full flex flex-col gap-4 border border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-semibold">Manage Access</h1>
          <AddEditorModal org_id={params.org_id} users={users} />
        </div>
        <TabList className="flex gap-2 text-white border-b border-gray-700">
          <Tab className="pb-2 px-2 border-b-2 border-transparent data-[selected]:border-blue-500 outline-none">
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
          <TabPanel className="flex flex-col gap-2 bg-gray-800 px-2 rounded-lg">
            <div className="flex gap-2 md:gap-4 pb-1 border-b border-gray-700">
              <MagnifyingGlassIcon className="w-5 md:w-6" />
              <input
                type="text"
                placeholder="Find Editors..."
                className="bg-inherit focus:outline-none text-white py-2 rounded-md w-full"
              />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              {activeEditors.map((editor) => (
                <div
                  key={editor.editor_id}
                  className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
                >
                  <div className="flex items-center">
                    <UserCircleIcon className="w-6 md:w-8 text-green-400" />
                    <span className="ml-4 text-green-400 font-bold capitalize">
                      {editor.user.name} {editor.user?.middlename}{" "}
                      {editor.user.lastname}
                    </span>
                  </div>
                  <div className="mt-2 md:mt-0">
                    {editor.user_id == currentUser.user_id ? (
                      <div className="bg-green-700 px-4 py-2 rounded-md w-full">
                        You
                      </div>
                    ) : (
                      <RemoveEditor editor_id={editor.editor_id} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>
          <TabPanel className="flex flex-col gap-2 bg-gray-800 px-2 rounded-lg">
            {suspendedEditors.length > 0 ? (
              <>
                <div className="flex gap-2 md:gap-4 pb-4 border-b border-gray-700">
                  <MagnifyingGlassIcon className="w-5 md:w-6" />
                  <input
                    type="text"
                    placeholder="Find Editors.."
                    className="bg-inherit focus:outline-none text-white py-2 rounded-md w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {suspendedEditors.map((editor) => (
                    <div
                      key={editor.editor_id}
                      className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex items-center">
                        <UserCircleIcon className="w-6 md:w-8" />
                        <span className="ml-4 text-green-400 font-bold">
                          {editor.user.name} {editor.user?.middlename}{" "}
                          {editor.user.lastname}
                        </span>
                      </div>
                      <div className="mt-2 md:mt-0">
                        {/*  <RemoveEditor editor_id={editor.editor_id} /> */}
                        <ReactivateEditor editor_id={editor.editor_id} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              "No Suspended Editors!"
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}

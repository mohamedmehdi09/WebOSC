import { prisma } from "@/lib/prisma";
import { CreateOrg } from "@/lib/actions";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import SelectUserCombobox from "@/components/SelectUserCombobox";
import { checkEmailValidation, checkSuperUser } from "@/lib/authorization";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getOrgs() {
  const orgs = await prisma.organization.findMany();
  return orgs;
}

async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      user_id: true,
      name: true,
      lastname: true,
      middlename: true,
      email: true,
      isMale: true,
    },
    where: { emailVerified: true },
  });
  return users;
}

export default async function CreateOrgPage() {
  if (!checkSuperUser()) return <>not allowed!</>;
  if (!checkEmailValidation()) return redirect("/emailVerification");
  else return <CreateOrgComponent />;
}

const CreateOrgComponent = async () => {
  const orgs = await getOrgs();
  const users = await getUsers();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white">
      <form
        action={CreateOrg}
        className="bg-slate-800 p-6 sm:p-8 md:p-10 rounded-md w-full max-w-md flex flex-col items-center gap-4 border border-gray-300"
      >
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          Create Organization
        </h1>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="nameEn" className="font-medium">
            English Name
          </label>
          <input
            type="text"
            name="nameEn"
            id="nameEn"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none"
            required
            autoFocus
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="nameAr" className="font-medium">
            Arabic Name
          </label>
          <input
            type="text"
            name="nameAr"
            id="nameAr"
            className="w-full p-3 border border-gray-300 text-right rounded-md bg-gray-800 outline-none"
            required
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="org_id" className="font-medium">
            Identifier
            <QuestionMarkCircleIcon
              className="h-5 inline ml-1"
              title="A unique identifier for the created organization"
            />
          </label>
          <input
            type="text"
            name="org_id"
            id="org_id"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none"
            required
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="parent_org_id" className="font-medium">
            Select Parent
          </label>
          <select
            name="parent_org_id"
            id="parent_org_id"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none"
          >
            <option key="null" value={"null"}>
              None
            </option>
            {orgs.map((org) => (
              <option key={org.org_id} value={org.org_id}>
                {org.nameEn}
              </option>
            ))}
          </select>
        </div>
        <SelectUserCombobox users={users} />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

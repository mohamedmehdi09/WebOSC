import { prisma } from "@/lib/prisma";
import { CreateOrg } from "@/lib/actions";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { QueueListIcon } from "@heroicons/react/24/solid";
async function getOrgs() {
  try {
    const orgs = await prisma.organization.findMany();
    return orgs;
  } catch (error) {
    console.log("operation faild");
    throw Error("could not connect  to prisma");
  }
}

export default async function CreateOrgPage() {
  const orgs = await getOrgs();
  return (
    <form
      action={CreateOrg}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-bold mb-4 text-center">
        Create Organization
      </h1>
      <div className="mb-4">
        <label
          htmlFor="nameEn"
          className="block text-gray-700 font-medium mb-2"
        >
          English Name
        </label>
        <input
          type="text"
          name="nameEn"
          id="nameEn"
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="nameAr"
          className="block text-gray-700 font-medium mb-2"
        >
          Arabic Name
        </label>
        <input
          type="text"
          name="nameAr"
          id="nameAr"
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="id"
          className="text-gray-700 font-medium mb-2 flex items-center gap-1"
        >
          identifier
          <QuestionMarkCircleIcon
            className="h-5"
            title="a unique identifier for the created orgnaization"
          />
        </label>
        <input
          type="text"
          name="id"
          id="id"
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="parent_org_id"
          className="block text-gray-700 font-medium mb-2"
        >
          Select Parent
        </label>
        <select
          name="parent_org_id"
          id="parent_org_id"
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option key="null" value={"null"}>
            None
          </option>
          {orgs.map((org) => (
            <option key={org.id} value={org.id}>
              {org.nameEn}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
      >
        Submit
      </button>
    </form>
  );
}

import OrgNavBar from "@/components/OrgNavBar";
import { checkOrgPrivilage, checkSuperUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const orgExists = async (org_id: string) => {
  const org = await prisma.organization.count({ where: { org_id } });
  return org > 0;
};

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { org_id: string };
}) {
  if (!(await orgExists(params.org_id)))
    return (
      <div className="flex flex-1 flex-col gap-5 items-center justify-center text-xl">
        <span>
          <span className="font-semibold text-2xl"> {params.org_id} </span>
          Not found!
        </span>
        <Link
          href="/"
          className="font-normal text-lg py-2 px-4 bg-blue-800 rounded-md hover:bg-blue-900"
        >
          Go Home
        </Link>
      </div>
    );
  const isEditor = await checkOrgPrivilage(params.org_id);
  const sudo = checkSuperUser();
  const segmentsList =
    isEditor || sudo ? ["posts", "editors", "settings"] : ["posts", "editors"];
  return (
    <>
      <OrgNavBar org_id={params.org_id} segmentsList={segmentsList} />
      <main className="text-white bg-gray-900 pt-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </>
  );
}

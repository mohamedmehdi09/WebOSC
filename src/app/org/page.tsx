import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getOrgs() {
  const orgs = await prisma.organization.findMany({
    include: { _count: { select: { editors: true } } },
  });
  return orgs;
}

export const dynamic = "force-dynamic";

export default async function OrgsPage() {
  const orgs = await getOrgs();
  return (
    <div className="flex flex-1 flex-col gap-3 w-full p-2 items-center">
      <div className="text-3xl">Manage Organizations:</div>
      {orgs.length == 0 ? (
        <>
          <div>no organizations created</div>
        </>
      ) : (
        <>
          {orgs.map((org) => (
            <Link
              href={`/org/${org.id}`}
              key={org.id}
              className="flex justify-between items-center bg-slate-800 rounded-md p-5 shadow-lg w-1/2 font-bold text-xl"
            >
              <span>{org.nameEn}</span>
              <span className="bg-gray-900 px-2 py-1 rounded-md">
                {org._count.editors}
              </span>
            </Link>
          ))}
        </>
      )}
      <Link
        href={"/org/create"}
        className="p-4 bg-blue-500 text-white py-3 rounded w-1/4 text-center"
      >
        Create an Organization
      </Link>
    </div>
  );
}

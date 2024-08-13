"use server";

import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getOrgs() {
  const orgs = await prisma.organization.findMany();
  console.log(orgs);
  return orgs;
}

export default async function Home() {
  const orgs = await getOrgs();
  return (
    <main className="min-h-screen flex flex-col gap-3 w-full p-2 items-center">
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
              className="bg-red-200 rounded p-5 shadow-lg w-1/2 text-center"
            >
              {org.nameEn}
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
    </main>
  );
}

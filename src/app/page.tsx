"use server";

import Link from "next/link";

export default async function RootPage() {
  return (
    <div>
      <Link href={"/org"} className="bg-blue-500 text-white rounded p-4">
        Manage Organizations
      </Link>
    </div>
  );
}

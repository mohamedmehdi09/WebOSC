"use server";

import Link from "next/link";

export default async function Home() {
  return (
    <main className="min-h-screen p-5">
      <Link href={"/org"} className="bg-blue-500 text-white rounded p-4">
        Manage Organizations
      </Link>
    </main>
  );
}

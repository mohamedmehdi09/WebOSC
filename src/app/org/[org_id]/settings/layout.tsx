"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function OrgSettingsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { org_id: string };
}) {
  return (
    <div className="flex flex-1 w-full rounded-md border">
      <div className="flex flex-col w-1/4 p-2 border-r-2">
        <Link
          href={`/org/${params.org_id}/settings/editors`}
          className="w-full hover:bg-green-700 rounded-md p-2"
        >
          editors
        </Link>
      </div>
      <div className="flex flex-1 p-2 relative">{children}</div>
    </div>
  );
}

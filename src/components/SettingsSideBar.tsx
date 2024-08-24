"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CogIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function SettingsSideBar({ org_id }: { org_id: string }) {
  const path = usePathname();
  return (
    <div className="flex flex-col gap-2 p-2 w-full md:w-1/4">
      <Link
        data-current={path == `/org/${org_id}/settings`}
        href={`/org/${org_id}/settings`}
        className="w-full hover:bg-green-700/25 data-[current=true]:bg-green-700 rounded-md p-2 flex items-center gap-2"
      >
        <CogIcon className="w-6 h-6" />
        <span className="text-sm md:text-base">General</span>
      </Link>
      <Link
        data-current={path == `/org/${org_id}/settings/editors`}
        href={`/org/${org_id}/settings/editors`}
        className="w-full hover:bg-green-700/25 data-[current=true]:bg-green-700 rounded-md p-2 flex items-center gap-2"
      >
        <UserGroupIcon className="w-6 h-6" />
        <span className="text-sm md:text-base">Editors</span>
      </Link>
    </div>
  );
}

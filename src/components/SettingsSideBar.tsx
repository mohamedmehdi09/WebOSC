"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CogIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function SettingsSideBar({ org_id }: { org_id: string }) {
  const path = usePathname();

  return (
    <div className="flex flex-col gap-2 p-4 w-full md:w-1/4 bg-[rgb(31,41,55)] shadow-lg rounded-md h-fit">
      <SidebarLink
        href={`/org/${org_id}/settings`}
        isActive={path === `/org/${org_id}/settings`}
        icon={<CogIcon className="w-6 h-6 text-white" />}
        label={
          <span className="text-base md:text-base lg:text-base text-white">
            General
          </span>
        }
      />
      <SidebarLink
        href={`/org/${org_id}/settings/editors`}
        isActive={path === `/org/${org_id}/settings/editors`}
        icon={<UserGroupIcon className="w-6 h-6 text-white" />}
        label={
          <span className="text-base md:text-base lg:text-base text-white">
            Editors
          </span>
        }
      />
    </div>
  );
}

function SidebarLink({
  href,
  isActive,
  icon,
  label,
}: {
  href: string;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors duration-200 ${
        isActive
          ? "bg-green-600 text-white"
          : "bg-transparent hover:bg-green-600/25 text-gray-300"
      }`}
    >
      {icon}
      <span className="text-sm md:text-base">{label}</span>
    </Link>
  );
}

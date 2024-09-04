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
        icon={<CogIcon className="w-5 md:w-6 text-white" />}
        label="General"
      />
      <SidebarLink
        href={`/org/${org_id}/settings/editors`}
        isActive={path === `/org/${org_id}/settings/editors`}
        icon={<UserGroupIcon className="w-5 md:w-6" />}
        label="Editors"
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
      className={`w-full flex items-center gap-2 p-2 md:p-3 rounded-md transition-colors duration-200 ${
        isActive ? "bg-green-600" : "bg-transparent hover:bg-green-600/25"
      }`}
    >
      {icon}
      <span className="md:text-lg">{label}</span>
    </Link>
  );
}

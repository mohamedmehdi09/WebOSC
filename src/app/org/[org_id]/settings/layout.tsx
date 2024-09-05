import SettingsSideBar from "@/components/SettingsSideBar";
import { ReactNode } from "react";
import { checkOrgPrivilage } from "@/lib/authorization";
import { checkEmailValidation } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function OrgSettingsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { org_id: string };
}) {
  if (!(await checkOrgPrivilage(params.org_id))) return "Not allowed!";
  if (!checkEmailValidation()) return redirect("/email/verify");

  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-4 lg:gap-8 rounded-md bg-[rgb(17,24,39)] p-4 pt-0 lg:p-8 lg:pt-0">
      <SettingsSideBar org_id={params.org_id} />
      <div className="flex flex-1 h-fit bg-[rgb(31,41,55)] shadow-lg rounded-md">
        {children}
      </div>
    </div>
  );
}

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
  if (!checkEmailValidation()) return redirect("/verify-email");

  return (
    <div className="flex flex-1 flex-col md:flex-row gap-4 md:gap-8 rounded-md bg-[rgb(17,24,39)] p-4 pt-0 md:p-8 md:pt-0">
      <SettingsSideBar org_id={params.org_id} />
      <div className="flex flex-1 bg-[rgb(31,41,55)] shadow-lg rounded-md p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}

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
  if (!(await checkOrgPrivilage(params.org_id))) return "not allowed";
  if (!checkEmailValidation()) return redirect("/emailVerification");
  return (
    <div className="flex flex-1 flex-col md:flex-row md:px-30 rounded-md">
      <SettingsSideBar org_id={params.org_id} />
      <div className="flex flex-1 p-2 pr-4 relative">{children}</div>
    </div>
  );
}

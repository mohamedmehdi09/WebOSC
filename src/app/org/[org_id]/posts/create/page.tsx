import CreateAnnouncementForm from "@/components/forms/CreateAnnouncementForm";
import { checkOrgPrivilage, checkEmailValidation } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function CreateAnnouncementPage({
  params,
}: {
  params: { org_id: string };
}) {
  if (!(await checkOrgPrivilage(params.org_id))) return "Not Allowed!";
  if (!checkEmailValidation()) return redirect("/email/verify");

  return <CreateAnnouncementForm org_id={params.org_id} />;
}

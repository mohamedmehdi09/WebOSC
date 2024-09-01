import { checkOrgPrivilage, checkEmailValidation } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function CreatePostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { org_id: string };
}) {
  if (!(await checkOrgPrivilage(params.org_id))) return "Not Allowed!";
  if (!checkEmailValidation()) return redirect("/verify-email");

  return children;
}

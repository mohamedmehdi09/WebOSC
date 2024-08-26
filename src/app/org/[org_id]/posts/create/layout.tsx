import { checkOrgPrivilage, checkEmailValidation } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function CreatePostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { org_id: string };
}) {
  const Authed = await checkOrgPrivilage(params.org_id);
  if (!Authed) return "Not Allowed!";
  const emailValid = checkEmailValidation();
  if (!emailValid) return redirect("/emailVerification?redirect=/org/create");

  return children;
}

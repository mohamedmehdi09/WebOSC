import { checkOrgPrivilage } from "@/lib/authorization";

export default async function CreatePostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { org_id: string };
}) {
  const isAuthed = await checkOrgPrivilage(params.org_id);
  return <>{isAuthed ? children : "Not Allowed!"}</>;
}

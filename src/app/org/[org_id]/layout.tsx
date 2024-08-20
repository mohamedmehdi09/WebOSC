import OrgNavBar from "@/components/OrgNavBar";
import { checkOrgPrivilage } from "@/lib/authorization";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { org_id: string };
}) {
  const isAuthed = await checkOrgPrivilage(params.org_id);
  const segmentsList = isAuthed
    ? ["posts", "editors", "settings"]
    : ["posts", "editors"];
  return (
    <>
      <OrgNavBar org_id={params.org_id} segmentsList={segmentsList} />
      <main className="text-white bg-gray-900 flex items-center justify-center flex-1 flex-col px-32 py-4">
        {children}
      </main>
    </>
  );
}

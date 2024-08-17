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

// const toastButton = toast.custom((t) => (
//   <button
//     className="bg-green-300 p-4 text-font-thin rounded-xl flex flex-col gap-2 border-[3px] border-green-700"
//     onClick={() => toast.dismiss(t.id)}
//   >
//     <div className="flex items-center gap-2 font-bold text-green-900 text-lg">
//       <CheckIcon className="w-4" />
//       Success
//     </div>
//     user Created Successfully
//   </button>
// ));

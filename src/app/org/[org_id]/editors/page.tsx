import { prisma } from "@/lib/prisma";
import Link from "next/link";

const getOrgEditors = async (org_id: string) => {
  const editors = await prisma.editor.findMany({
    where: {
      org_id: org_id,
    },
    include: {
      user: true,
    },
  });
  return editors;
};

export default async function OrgEditorsPage({
  params,
}: {
  params: { org_id: string };
}) {
  const editors = await getOrgEditors(params.org_id);
  return editors.length == 0 ? (
    <>
      <div>no Editors in this Organization</div>
    </>
  ) : (
    <>
      {editors.map((editor) => (
        <Link
          href={`/org/${params.org_id}/posts/${editor.editor_id}`}
          key={editor.editor_id}
          className="bg-red-200 rounded p-5 shadow-lg w-1/2 text-center"
        >
          {editor.user.name} {editor.user.lastname}
        </Link>
      ))}
    </>
  );
}

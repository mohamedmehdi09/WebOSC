"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { org_id: string };
}) {
  const path = usePathname();
  console.log(path);
  return (
    <>
      <nav className="bg-gray-800 h-24 w-full">
        <div className="text-gray-300 h-1/2 flex px-5 py-1 items-center  gap-2">
          <Link className="h-full p-1 hover:bg-gray-900 rounded-md" href={"/"}>
            <img
              src="/logo-white.png"
              alt="osca"
              className="h-full aspect-square"
            />
          </Link>
          <Link
            data-current={path === `/org/${params.org_id}`}
            href={`/org/${params.org_id}`}
            className="flex items-center justify-center text-xl  p-1 hover:bg-slate-600 rounded-md data-[current=true]:font-bold data-[current=true]:text-white"
          >
            {params.org_id}
          </Link>
          {path !== `/org/${params.org_id}` && (
            <>
              <span className="text-gray-300">/</span>
              <Link
                href={path}
                className="flex items-center justify-center text-xl  p-1 hover:bg-slate-600 rounded-md font-bold text-white"
              >
                {path.split("/")[3]}
              </Link>
            </>
          )}
        </div>
        <div className="text-white h-1/2 flex p-2 gap-2">
          <Link
            data-seleted={"posts" === path.split("/")[3]}
            href={`/org/${params.org_id}/posts`}
            className="h-full flex items-center justify-center p-4 text-center rounded-md  data-[seleted=true]:bg-slate-600"
          >
            posts
          </Link>
          <Link
            data-seleted={"editors" === path.split("/")[3]}
            href={`/org/${params.org_id}/editors`}
            className="h-full flex items-center justify-center p-4 text-center rounded-md  data-[seleted=true]:bg-slate-600"
          >
            editors
          </Link>
          <Link
            data-seleted={"manage" === path.split("/")[3]}
            href={`/org/${params.org_id}/manage`}
            className="h-full flex items-center justify-center p-4 text-center rounded-md  data-[seleted=true]:bg-slate-600"
          >
            manage
          </Link>
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </>
  );
}

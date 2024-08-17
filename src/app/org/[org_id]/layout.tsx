/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { CheckIcon } from "@heroicons/react/24/solid";

const linkList = ["posts", "editors", "settings"];

export default function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { org_id: string };
}) {
  const path = usePathname();
  return (
    <>
      <Toaster position="top-right" />
      <nav className="bg-black h-28 w-full border-b border-gray-500">
        <div className="text-gray-300 text-md h-1/2 flex px-5 py-2 items-end gap-2">
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
            className="flex items-center justify-center p-1 hover:bg-slate-900 rounded-md data-[current=true]:font-bold data-[current=true]:text-white"
          >
            {params.org_id}
          </Link>
          {path !== `/org/${params.org_id}` && (
            <>
              <span className="text-gray-300 flex items-center justify-center p-1">
                /
              </span>
              <Link
                href={path}
                className="flex items-center justify-center  p-1 hover:bg-gray-900 rounded-md font-bold text-white"
              >
                {path.split("/")[3]}
              </Link>
            </>
          )}
        </div>
        <div className="text-white h-1/2 flex p-2 gap-2">
          {linkList.map((link) => (
            <Link
              key={link}
              data-seleted={link === path.split("/")[3]}
              href={`/org/${params.org_id}/${link}`}
              className="h-full flex items-center justify-center p-4 text-center rounded-md  data-[seleted=true]:bg-gray-900 hover:bg-gray-900/75 data-[seleted=true]:font-bold"
            >
              {link}
            </Link>
          ))}
        </div>
      </nav>
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

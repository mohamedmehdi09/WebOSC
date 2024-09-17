"use client";

import RemoveEditor from "@/components/RemoveEditor";
import { TokenPayload } from "@/lib/types";
import { UserCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Editor } from "@prisma/client";
import { useState } from "react";
import ReactivateEditor from "./ReactivateEditor";

export default function SettingsEditorList({
  editors,
  currentUser,
}: {
  editors: (Editor & {
    user: {
      user_id: string;
      name: string;
      middlename: string | null;
      lastname: string;
      email: string;
    };
  })[];

  currentUser: TokenPayload | undefined;
}) {
  const [filteredEditors, setFilteredEditors] = useState(editors);
  return (
    <>
      <div className="flex gap-2 lg:gap-4 pb-1 border-b border-gray-700">
        <MagnifyingGlassIcon className="w-5 lg:w-6" />
        <input
          type="text"
          onChange={(e) => {
            setFilteredEditors(
              editors.filter(
                (editor) =>
                  editor.user.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  editor.user.lastname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  editor.user.middlename
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  editor.user_id
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()),
              ),
            );
          }}
          placeholder="Filter Editors..."
          className="bg-inherit focus:outline-none text-white py-2 rounded-md w-full"
        />
      </div>
      <div className="flex flex-col gap-2 pt-2">
        {filteredEditors.map((editor) => (
          <div
            key={editor.editor_id}
            className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
          >
            <div className="flex items-center text-green-400">
              <UserCircleIcon className="w-8" />
              <span className="ml-4 text-xs lg:text-base font-semibold lg:font-bold capitalize">
                {editor.user.name} {editor.user?.middlename}{" "}
                {editor.user.lastname}
              </span>
            </div>
            <div className="mt-2 lg:mt-0">
              {editor.user_id == currentUser?.user_id ? (
                <div className="bg-green-700 px-3 lg:px-4 py-1 lg:py-2 rounded-md w-full">
                  You
                </div>
              ) : editor.status == "active" ? (
                <RemoveEditor editor_id={editor.editor_id} />
              ) : (
                <ReactivateEditor editor_id={editor.editor_id} />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

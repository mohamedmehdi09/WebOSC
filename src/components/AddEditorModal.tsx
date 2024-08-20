"use client";

import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { Editor, User } from "@prisma/client";
import { addEditorToOrg } from "@/lib/actions";
import SelectUserCombobox from "./SelectUserCombobox";

export default function AddEditorModal({
  users,
  org_id,
}: {
  users: ({ editors: Editor[] } & User)[];
  org_id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }
  return (
    <>
      <button
        onClick={open}
        className="rounded-md bg-green-700 py-2 px-4 text-sm font-medium hover:bg-green-800 flex gap-2 items-center"
      >
        <UserPlusIcon className="w-6" />
        Add An Editor
      </button>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 bg-black/75">
            <DialogPanel className="flex flex-col gap-6 w-full max-w-md rounded-md bg-slate-800 text-white p-6 backdrop-blur-2xl">
              <DialogTitle as="h3" className="font-bold text-lg">
                Add Editor
              </DialogTitle>
              <form
                action={(form) => {
                  // TODO: add notification logic here
                  form.append("org_id", org_id);
                  addEditorToOrg(form);
                }}
                className="flex flex-col gap-6"
              >
                <SelectUserCombobox users={users} />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={close}
                    className="inline-flex items-center gap-2 rounded-md bg-red-700 py-1.5 px-5 text-md font-semibold shadow-inner shadow-white/10 focus:outline-none hover:bg-red-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md bg-green-700 py-1.5 px-5 text-md font-semibol shadow-inner shadow-white/10 focus:outline-none hover:bg-green-800"
                  >
                    Add
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

"use client";

import { FormEvent, useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { User } from "@prisma/client";
import { addEditorToOrg } from "@/lib/actions";
import SelectUserCombobox from "./SelectUserCombobox";
import toast from "react-hot-toast";

export default function AddEditorModal({
  users,
  org_id,
}: {
  users: Omit<User, "password">[];
  org_id: string;
}) {
  const [formState, formAction] = useFormState(addEditorToOrg, {
    error: null,
    message: "",
  });
  const { pending } = useFormStatus();

  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (formState.error == null) return;
    if (formState.error) toast.error(formState.message);
    else {
      window.location.reload();
    }
  }, [formState]);

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
                action={(form: FormData) => {
                  form.append("org_id", org_id);
                  formAction(form);
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
                    className="inline-flex items-center gap-2 rounded-md bg-green-700 py-1.5 px-5 text-md font-semibol shadow-inner shadow-white/10 focus:outline-none hover:bg-green-800 disabled:bg-gray-600"
                    onClick={(event: FormEvent) => {
                      if (pending) {
                        event.preventDefault();
                      }
                    }}
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

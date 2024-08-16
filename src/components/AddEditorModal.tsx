"use client";

import { useState } from "react";
import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

import clsx from "clsx";
import { Editor, User } from "@prisma/client";
import { addEditorToOrg } from "@/lib/actions";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function AddEditorModal({
  users,
  org_id,
}: {
  users: ({ editors: Editor[] } & User)[];
  org_id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User | null>(null);

  const filteredUsers =
    query === ""
      ? users
      : users.filter((user) => {
          return user.name.toLowerCase().includes(query.toLowerCase());
        });
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
        className="rounded-md bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-800"
      >
        Open dialog
      </button>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 bg-black/75">
            <DialogPanel className="flex flex-col gap-6 w-full max-w-md rounded-md bg-gray-900 p-6 backdrop-blur-2xl">
              <DialogTitle as="h3" className="font-medium text-white">
                Add Editor
              </DialogTitle>
              <Combobox
                value={selected}
                onChange={(value) => setSelected(value)}
                onClose={() => setQuery("")}
              >
                <div className="relative">
                  <ComboboxInput
                    className={clsx(
                      "w-full rounded-md border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                    displayValue={(user: User | null) =>
                      user ? user?.name + " " + user?.lastname : ""
                    }
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                    <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                  </ComboboxButton>
                </div>

                <ComboboxOptions
                  anchor="bottom"
                  transition
                  className={clsx(
                    "w-[var(--input-width)] rounded-md border border-white/50 bg-gray-600 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible z-30",
                    "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 flex flex-col gap-2",
                  )}
                >
                  <ComboboxOption
                    key={0}
                    value={null}
                    className="group flex cursor-default items-center gap-2 rounded-md py-1.5 px-4 select-none data-[focus]:bg-white/10"
                  >
                    <XMarkIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                    <div className="text-sm/6 text-white">select a user</div>
                  </ComboboxOption>
                  {filteredUsers.map(
                    (user) =>
                      user.editors.length == 0 && (
                        <ComboboxOption
                          key={user.user_id}
                          value={user}
                          className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-4 select-none data-[focus]:bg-white/10"
                        >
                          <CheckIcon className="size-4 fill-white" />
                          <div className="text-sm/6 text-white">
                            {user.name} {user.lastname}
                          </div>
                        </ComboboxOption>
                      ),
                  )}
                </ComboboxOptions>
              </Combobox>

              <form
                action={() => {
                  // TODO: add notification logic here
                  if (!selected) return;
                  const form = new FormData();
                  form.append("user_id", selected?.user_id);
                  form.append("org_id", org_id);
                  addEditorToOrg(form);
                }}
                className="flex gap-2"
              >
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-green-600 py-1.5 px-5 text-md font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-green-800"
                >
                  Add
                </button>
                <button
                  onClick={close}
                  className="inline-flex items-center gap-2 rounded-md bg-red-600 py-1.5 px-5 text-md font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-red-800"
                >
                  Cancel
                </button>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

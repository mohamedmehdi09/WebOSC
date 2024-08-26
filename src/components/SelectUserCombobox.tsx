"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import clsx from "clsx";
import { User } from "@prisma/client";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function SelectUserCombobox({
  users,
}: {
  users: Omit<User, "password">[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const filteredUsers =
    query === ""
      ? users
      : users.filter((user) => {
          return user.name.toLowerCase().includes(query.toLowerCase());
        });
  return (
    <Combobox
      value={selected}
      name="user_id"
      onChange={(value) => setSelected(value)}
      onClose={() => setQuery("")}
    >
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="nameEn" className="font-medium">
          Select User:
        </label>
        <div className="relative">
          <ComboboxInput
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none"
            displayValue={() => selected?.user_id || ""}
            name="user_id"
            onChange={(event) => setQuery(event.target.value)}
            required
          />
          <ComboboxButton className="group absolute right-0 m-4">
            <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
          </ComboboxButton>
        </div>
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
          <div className="text-sm/6 text-white">Select User</div>
        </ComboboxOption>
        {filteredUsers.map((user) => (
          <ComboboxOption
            key={user.user_id}
            value={user}
            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-4 select-none data-[focus]:bg-white/10"
          >
            <div className="flex flex-col">
              <div className="text-blue-400 font-extrabold">
                {user.name} {user.lastname}
              </div>
              <div className="text-gray-400 text-sm">@{user.user_id}</div>
            </div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}

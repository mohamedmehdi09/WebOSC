"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateAnnouncementPublishDate } from "@/lib/actions";
import toast from "react-hot-toast";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function UpdateAnnouncementPublishDateForm({
  publishes_at,
  announcement_id,
}: {
  publishes_at: Date;
  announcement_id: number;
}) {
  const [formState, formAction] = useFormState(updateAnnouncementPublishDate, {
    success: null,
    message: "",
  });

  const [edit, setEdit] = useState(false);

  const { pending } = useFormStatus();

  useEffect(() => {
    if (formState.success === true) {
      toast.success(formState.message);
      setEdit(false);
      setTimeout(() => window.location.reload(), 1000);
    }
    if (formState.success === false) toast.error(formState.message);
  }, [formState]);

  return (
    <form
      action={(form: FormData) => {
        form.append("announcement_id", announcement_id.toString());
        console.log(form);
        formAction(form);
      }}
      className="flex flex-col gap-1 w-full md:w-1/2"
    >
      <h3 className="text-lg font-semibold">Publishes At:</h3>
      <div className="flex gap-2 flex-1 items-center">
        <input
          defaultValue={new Date(
            publishes_at.getTime() -
              publishes_at.getTimezoneOffset() * 60 * 1000,
          )
            .toISOString()
            .slice(0, 16)}
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-900 outline-none invalid:border-red-800"
          aria-label="Date and time"
          type="datetime-local"
          name="publishes_at"
          required
          readOnly={!edit}
          hidden={!edit}
        />
        <span hidden={edit}>
          {publishes_at
            ? publishes_at.toLocaleDateString("en-UK", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })
            : "not spacified"}
        </span>
        <button
          type="button"
          onClick={() => setEdit(!edit)}
          hidden={edit}
          className="p-1 rounded-md bg-gray-800 text-gray-400 hover:text-white focus:ring-2 focus:ring-gray-500"
        >
          <PencilIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-row gap-2">
        <button
          disabled={pending}
          type="submit"
          hidden={!edit}
          className="px-4 md:px-6 py-1 border border-green-300 rounded-md bg-green-600 disabled:text-gray-400 disabled:border-gray-800"
        >
          update
        </button>
        <button
          type="button"
          onClick={() => setEdit(false)}
          hidden={!edit}
          className="px-4 md:px-6 py-1 border border-red-300 rounded-md bg-red-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

"use client";

import { addAnnouncement } from "@/lib/actions";
import { useState, useEffect, FormEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";

export default function CreatePostPage({
  params,
}: {
  params: { org_id: string };
}) {
  const [formState, formAction] = useFormState(addAnnouncement, {
    error: null,
    message: "",
    announcement_id: 0,
  });

  const { pending } = useFormStatus();

  const [titleCount, setTitleCount] = useState(0);

  useEffect(() => {
    if (formState.error == null) return;
    if (formState.error) toast.error(formState.message);
    else {
      toast.success(formState.message);
      setTimeout(
        () =>
          window.location.replace(`/announcement/${formState.announcement_id}`),
        1000
      );
    }
  }, [formState]);
  return (
    <form
      action={(form: FormData) => {
        form.append("org_id", params.org_id);
        formAction(form);
      }}
      className="rounded-md w-full flex flex-1 gap-4 relative p-4 sm:p-8"
    >
      <div className="flex flex-col flex-1">
        <div className="relative">
          <input
            type="text"
            name="title"
            placeholder="Title.."
            required
            autoFocus
            maxLength={40}
            spellCheck
            className="w-full px-4 py-2 sm:px-8 sm:py-4 outline-none text-2xl font-semibold sm:text-4xl bg-gradient-to-b from-slate-600 to-slate-700 rounded-t-md"
            onChange={(e) => {
              setTitleCount(e.target.value.length);
            }}
          />
          <span
            data-maxed={titleCount == 40}
            className="absolute right-2 sm:right-4 top-2 sm:top-4 text-white/75 data-[maxed=true]:text-red-500/75 text-xs sm:text-sm"
          >
            {titleCount}/40
          </span>
        </div>
        <textarea
          name="body"
          placeholder="Body.."
          required
          maxLength={2000}
          className="w-full px-4 py-2 sm:px-12 sm:py-4 bg-gradient-to-b from-slate-700 to-slate-800 outline-none resize-none text-lg sm:text-2xl font-medium flex flex-1 rounded-b-md"
        />
      </div>

      <div className="bg-gray-600 w-1/4 p-4 rounded-md relative flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold">Publish At:</h3>
          <input
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-900 outline-none invalid:border-red-800"
            aria-label="Date and time"
            type="datetime-local"
            name="publishes_at"
            required
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Ends Publishing At:</h3>
          <input
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-900 outline-none invalid:border-red-800"
            aria-label="Date and time"
            type="datetime-local"
            name="ends_at"
            required
          />
        </div>
        <button
          disabled={pending || formState.error === false}
          className="absolute bottom-4 right-4 left-4 bg-green-700 hover:bg-green-800 mt-4 p-2 sm:p-3 rounded-md self-end transition-colors duration-300 focus:outline-green-800 disabled:bg-gray-600"
          type="submit"
          onClick={(event: FormEvent) => {
            if (pending) {
              event.preventDefault();
            }
          }}
        >
          Create Post
        </button>
      </div>
    </form>
  );
}

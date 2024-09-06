"use client";

import { createAnnouncement } from "@/lib/actions/announcementActions";
import { useState, useEffect, FormEvent } from "react";
import { FormState } from "@/lib/types";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

const initFormState: FormState = {
  success: null,
  redirect: null,
  message: null,
};

export default function CreatePostPage({
  params,
}: {
  params: { org_id: string };
}) {
  const [createAnnouncementFormState, createAnnouncementFormAction] =
    useFormState(createAnnouncement, initFormState);

  const [titleCount, setTitleCount] = useState<number>(0);
  const [toastID, setToastID] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (createAnnouncementFormState.success == null) return;
    if (!createAnnouncementFormState.success) {
      toast.error(createAnnouncementFormState.message, { id: toastID });
      setToastID(undefined);
    } else {
      toast.success(createAnnouncementFormState.message, { id: toastID });
      setToastID(undefined);
      const redirect = createAnnouncementFormState.redirect;
      if (redirect) setTimeout(() => window.location.replace(redirect), 1000);
    }
  }, [createAnnouncementFormState]);
  return (
    <form
      action={(form: FormData) => {
        form.append("org_id", params.org_id);
        const toastID = toast.loading("Creating Announcement");
        setToastID(toastID);
        createAnnouncementFormAction(form);
      }}
      className="rounded-md w-full flex flex-col lg:flex-row flex-1 gap-4 p-2 lg:p-6"
    >
      <div className="flex flex-col flex-1">
        <div className="relative">
          <input
            type="text"
            name="title"
            placeholder="Title.."
            required
            autoFocus
            minLength={5}
            maxLength={40}
            spellCheck
            className="w-full px-4 py-2 sm:px-8 sm:py-4 outline-none text-2xl font-semibold sm:text-4xl bg-gradient-to-b from-slate-600 to-slate-700 rounded-t-md invalid:text-red-500"
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
          minLength={10}
          maxLength={2000}
          className="w-full px-4 py-2 sm:px-12 sm:py-4 bg-gradient-to-b from-slate-700 to-slate-800 outline-none resize-none text-lg sm:text-2xl font-medium flex flex-1 rounded-b-md invalid:text-red-500"
        />
      </div>
      <div className="bg-gray-800 lg:w-1/4 h-fit p-4 rounded-md flex flex-col gap-4">
        <div>
          <h3 className="lg:text-lg mb-2 font-semibold">Publish At:</h3>
          <input
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-900 outline-none invalid:border-red-800"
            aria-label="Date and time"
            type="datetime-local"
            name="publishes_at"
            required
          />
        </div>
        <div>
          <h3 className="lg:text-lg mb-2 font-semibold">Ends Publishing At:</h3>
          <input
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-900 outline-none invalid:border-red-800"
            aria-label="Date and time"
            type="datetime-local"
            name="ends_at"
            required
          />
        </div>
        <button
          disabled={
            toastID !== undefined || createAnnouncementFormState.success == true
          }
          className="w-full bg-green-700 hover:bg-green-800 p-2 mt-6 sm:p-3 rounded-md self-end transition-colors duration-300 focus:outline-green-800 disabled:bg-gray-800/60"
          type="submit"
        >
          Create Post
        </button>
      </div>
    </form>
  );
}

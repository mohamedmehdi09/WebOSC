"use client";

import { addAnnouncement } from "@/lib/actions";
import { useState } from "react";

export default function CreatePostPage({
  params,
}: {
  params: { org_id: string };
}) {
  const [titleCount, setTitleCount] = useState(0);
  return (
    <>
      <form
        action={(form) => {
          form.append("org_id", params.org_id);
          addAnnouncement(form);
        }}
        className="rounded w-full max-w-4xl mx-auto flex flex-col flex-1 text-white relative p-4 sm:p-8"
      >
        <div className="relative">
          <input
            type="text"
            name="title"
            placeholder="Title.."
            required
            autoFocus
            maxLength={40}
            className="w-full px-4 py-2 sm:px-8 sm:py-4 outline-none text-2xl sm:text-4xl bg-gradient-to-b from-slate-600 to-slate-700 rounded-t-md"
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
          className="w-full px-4 py-2 sm:px-8 sm:py-4 bg-gradient-to-b from-slate-700 to-slate-800 outline-none resize-none text-lg sm:text-2xl flex-grow overflow-scroll rounded-b-md"
        />

        <button
          className="bg-green-700 hover:bg-green-800 text-white mt-4 p-2 sm:p-3 rounded-md self-end transition-colors duration-300 focus:outline-green-800"
          type="submit"
        >
          Create Post
        </button>
      </form>
    </>
  );
}

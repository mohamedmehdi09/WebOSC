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
          console.log("create post");
          form.append("org_id", params.org_id);
          console.log(form);
          addAnnouncement(form);
        }}
        className="rounded w-full flex flex-col flex-1 text-white relative"
      >
        <div className="relative">
          <input
            type="text"
            name="title"
            placeholder="Title..."
            required
            autoFocus
            maxLength={40}
            className="w-full px-8 py-4 outline-none text-4xl bg-gradient-to-b from-slate-600 to-slate-700 rounded-t-md"
            onChange={(e) => {
              setTitleCount(e.target.value.length);
            }}
          />
          <span
            data-maxed={titleCount == 40}
            className="absolute right-0 m-4 text-white/75 data-[maxed=true]:text-red-500/75 text-sm"
          >
            {titleCount}/40
          </span>
        </div>
        <textarea
          name="body"
          placeholder="Body..."
          required
          className="w-full px-8 py-4 bg-gradient-to-b from-slate-700 to-slate-800 outline-none resize-none text-4xl flex-grow overflow-scroll rounded-b-md"
        />

        <button
          className="bg-green-700 hover:bg-green-800 text-white m-5 p-2 rounded-md absolute bottom-0 right-0 transition-colors duration-300 focus:outline-green-800"
          type="submit"
        >
          Create Post
        </button>
      </form>
    </>
  );
}

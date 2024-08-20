"use client";

import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CopyToClipboardButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast.custom((t) => (
          <button
            className="bg-green-300 p-4 text-font-thin rounded-xl flex flex-col gap-2 border-[3px] border-green-700"
            onClick={() => toast.dismiss(t.id)}
          >
            <div className="flex items-center gap-2 font-bold text-green-900 text-lg">
              <CheckIcon className="w-4" />
              Success
            </div>
            Copied to Clipboard
          </button>
        ));
        setCopied(true);
      }}
      type="button"
      title="copy to clipboard"
      className="rounded-md p-2 bg-gray-800"
    >
      {copied ? (
        <ClipboardDocumentCheckIcon className="w-6" />
      ) : (
        <ClipboardDocumentIcon className="w-6" />
      )}
    </button>
  );
}

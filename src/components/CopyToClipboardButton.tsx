"use client";

import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CopyToClipboardButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Copied to Clipboard");
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

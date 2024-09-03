"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateAnnouncementPublishDate } from "@/lib/actions";
import toast from "react-hot-toast";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

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

  const [editMode, setEditMode] = useState(false);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (formState.success === true) {
      toast.success(formState.message);
      setEditMode(false);
      setTimeout(() => window.location.reload(), 1000);
    } else if (formState.success === false) {
      toast.error(formState.message);
    }
  }, [formState]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("announcement_id", announcement_id.toString());
        formAction(formData);
      }}
      className="w-full max-w-lg p-4 bg-gray-800 rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold text-white mb-3">Publish Date</h3>
      <div className="flex items-center gap-4 mb-4">
        {editMode ? (
          <input
            defaultValue={
              publishes_at
                ? new Date(
                    publishes_at.getTime() -
                      publishes_at.getTimezoneOffset() * 60 * 1000
                  )
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-900 text-white outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Publish Date and Time"
            type="datetime-local"
            name="publishes_at"
            required
            autoFocus
          />
        ) : (
          <span className="text-gray-300">
            {publishes_at
              ? publishes_at.toLocaleDateString("en-UK", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              : "Not specified"}
          </span>
        )}
        <button
          type="button"
          onClick={editMode ? handleCancelClick : handleEditClick}
          className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label={editMode ? "Cancel" : "Edit"}
        >
          {editMode ? (
            <XMarkIcon className="w-5 h-5" />
          ) : (
            <PencilIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {editMode && (
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-500 disabled:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <CheckIcon className="w-5 h-5" />
            <span>Update</span>
          </button>
          <button
            type="button"
            onClick={handleCancelClick}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );
}

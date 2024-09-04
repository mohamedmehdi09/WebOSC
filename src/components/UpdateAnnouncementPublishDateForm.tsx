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
      className="w-full max-w-lg p-"
    >
      <h3 className="text-lg font-semibold">Publishing At:</h3>
      <div className="flex gap-2 flex-1 items-center">
        <input
          defaultValue={new Date(
            publishes_at.getTime() -
              publishes_at.getTimezoneOffset() * 60 * 1000
          )
            .toISOString()
            .slice(0, 16)}
          className="flex-1 p-3 border border-gray-600 rounded-md bg-gray-900 outline-none invalid:border-red-800"
          aria-label="Date and time"
          type="datetime-local"
          name="publishes_at"
          required
          readOnly={!editMode}
          hidden={!editMode}
        />
        <span
          className="w-full p-3 border border-gray-600 rounded-md bg-gray-900"
          hidden={editMode}
        >
          {publishes_at.toLocaleDateString("en-UK", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </span>
        <button
          type="button"
          onClick={editMode ? handleCancelClick : handleEditClick}
          className={`p-2 rounded-md  hover:font-bold text-gray-400 hover:text-white transition-colors duration-200 ${
            editMode ? "bg-red-600/60 hover:bg-red-600 " : "bg-gray-600"
          }`}
          aria-label={editMode ? "Cancel" : "Edit"}
        >
          {editMode ? (
            <XMarkIcon className="w-5 h-5" />
          ) : (
            <PencilIcon className="w-5 h-5" />
          )}
        </button>
        {editMode && (
          <button
            type="submit"
            disabled={pending || formState.success === true}
            className="flex items-center p-2 rounded-md bg-green-600/60 hover:bg-green-600 text-gray-400 hover:text-white disabled:bg-gray-800 focus:outline-none transition-colors duration-200"
          >
            <CheckIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
}

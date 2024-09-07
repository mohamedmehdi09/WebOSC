"use client";

import { useEffect, useState } from "react";
import { FormState } from "@/lib/types";
import { useFormState } from "react-dom";
import { updateAnnoucementTitle } from "@/lib/actions/announcementActions";
import toast from "react-hot-toast";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const initFormState: FormState = {
  success: null,
  redirect: null,
  message: null,
};

export default function UpdateAnnouncementTitleForm({
  title,
  announcement_id,
}: {
  title: string;
  announcement_id: number;
}) {
  const [updateAnnouncementTitleFormState, updateAnnouncementTitleformAction] =
    useFormState(updateAnnoucementTitle, initFormState);

  const [editMode, setEditMode] = useState(false);
  const [currentValue, setCurrentValue] = useState(title);
  const [toastID, setToastID] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (updateAnnouncementTitleFormState.success == null) return;
    if (!updateAnnouncementTitleFormState.success) {
      toast.error(updateAnnouncementTitleFormState.message, { id: toastID });
      setToastID(undefined);
    } else {
      toast.success(updateAnnouncementTitleFormState.message, {
        id: toastID,
      });
      setToastID(undefined);
      const redirect = updateAnnouncementTitleFormState.redirect;
      if (redirect) setTimeout(() => window.location.replace(redirect), 1000);
    }
  }, [updateAnnouncementTitleFormState]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setCurrentValue(title);
  };

  return (
    <form
      action={(form: FormData) => {
        form.append("announcement_id", announcement_id.toString());
        const toastID = toast.loading("Updating Announcement Title...");
        setToastID(toastID);
        updateAnnouncementTitleformAction(form);
      }}
      className="flex items-center justify-between"
    >
      <input
        value={currentValue}
        onChange={(e) => {
          setCurrentValue(e.target.value);
        }}
        className={`w-full text-3xl lg:text-5xl font-bold bg-transparent outline-none flex-wrap ${editMode && "border-b-2 border-gray-400"}`}
        placeholder="Title..."
        type="text"
        name="title"
        required
        autoFocus
        maxLength={40}
        readOnly={!editMode}
      />

      <div className="flex gap-2">
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
            disabled={
              toastID !== undefined ||
              updateAnnouncementTitleFormState.success == true
            }
            className="flex items-center p-2 rounded-md bg-green-600/60 hover:bg-green-600 text-gray-400 hover:text-white disabled:bg-gray-800 focus:outline-none transition-colors duration-200"
          >
            <CheckIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
}

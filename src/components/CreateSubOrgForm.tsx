"use client";

import SelectUserCombobox from "@/components/SelectUserCombobox";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { FrontendUser } from "@/lib/types";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { FormState } from "@/lib/types";
import toast from "react-hot-toast";
import { createSubOrg } from "@/lib/actions/orgActions";

const initFormState: FormState = {
  success: null,
  redirect: null,
  message: null,
};

export default function CreateSubOrgForm({
  users,
  parent_org_id,
}: {
  users: FrontendUser[];
  parent_org_id: string;
}) {
  const [CreateSubOrgFormState, CreateSubOrgFormAction] = useFormState(
    createSubOrg,
    initFormState
  );

  const [toastID, setToastID] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (CreateSubOrgFormState.success == null) return;
    if (!CreateSubOrgFormState.success) {
      toast.error(CreateSubOrgFormState.message, { id: toastID });
      setToastID(undefined);
    } else {
      toast.success(CreateSubOrgFormState.message, {
        id: toastID,
      });
      setToastID(undefined);
      const redirect = CreateSubOrgFormState.redirect;
      if (redirect) setTimeout(() => window.location.replace(redirect), 1000);
    }
  }, [CreateSubOrgFormState]);

  return (
    <form
      action={(form: FormData) => {
        form.append("parent_org_id", parent_org_id);
        const toastID = toast.loading("Creating Organization");
        setToastID(toastID);
        CreateSubOrgFormAction(form);
      }}
      className="bg-slate-800 p-6 sm:p-8 lg:p-10 m-4 rounded-md w-full h-fit max-w-md flex flex-col items-center gap-4 border border-gray-300"
    >
      <h1 className="text-xl lg:text-2xl font-bold mb-4 text-center">
        Create Organization
      </h1>
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="nameEn" className="font-medium">
          English Name
        </label>
        <input
          type="text"
          name="nameEn"
          id="nameEn"
          className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none"
          required
          autoFocus
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="nameAr" className="font-medium">
          Arabic Name
        </label>
        <input
          type="text"
          name="nameAr"
          id="nameAr"
          className="w-full p-3 border border-gray-300 text-right rounded-md bg-gray-800 outline-none"
          required
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="org_id" className="font-medium">
          Identifier
          <QuestionMarkCircleIcon
            className="h-5 inline ml-1"
            title="A unique identifier for the created organization"
          />
        </label>
        <input
          type="text"
          name="org_id"
          id="org_id"
          className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none"
          required
        />
      </div>
      <SelectUserCombobox users={users} />
      <button
        type="submit"
        disabled={
          toastID !== undefined || CreateSubOrgFormState.success == true
        }
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
      >
        Submit
      </button>
    </form>
  );
}

"use client";
import { logout } from "@/lib/actions";
import { FormState } from "@/lib/types";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

const initFormState: FormState = {
  success: null,
  message: null,
  redirect: null,
};

export default function LogoutForm() {
  const [logoutFormState, logoutFormAction] = useFormState(
    logout,
    initFormState
  );
  const [toastID, setToastID] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (logoutFormState.success == null) return;
    if (!logoutFormState.success) {
      toast.error(logoutFormState.message, { id: toastID });
      setToastID(undefined);
    } else {
      toast.success(logoutFormState.message, { id: toastID });
      setToastID(undefined);
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [logoutFormState]);
  return (
    <form
      className="flex justify-center w-full"
      action={() => {
        const toastID = toast.loading("logging you out ...");
        setToastID(toastID);
        logoutFormAction();
      }}
    >
      <button
        disabled={toastID !== undefined || logoutFormState.success === true}
        type="submit"
        className="bg-red-700 hover:bg-red-600 rounded-md px-4 py-2 w-full transition-colors disabled:bg-slate-700"
      >
        Log Out
      </button>
    </form>
  );
}

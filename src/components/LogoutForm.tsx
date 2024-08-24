"use client";
import { logout } from "@/lib/actions";
import { FormEvent, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";

export default function LogOutForm() {
  const [formState, formAction] = useFormState(logout, {
    error: null,
    message: "",
  });
  const { pending } = useFormStatus();

  useEffect(() => {
    if (formState.error == null) return;
    if (formState.error) toast.error(formState.message);
    else {
      toast.success(formState.message);
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [formState]);
  return (
    <form className="flex justify-center w-full" action={formAction}>
      <button
        disabled={pending || formState.error === false}
        onClick={(event: FormEvent) => {
          if (pending) {
            event.preventDefault();
          }
        }}
        type="submit"
        className="bg-red-700 hover:bg-red-600 rounded-md px-4 py-2 w-full transition-colors disabled:bg-slate-700"
      >
        Log Out
      </button>
    </form>
  );
}

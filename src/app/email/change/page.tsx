"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { changeEmail } from "@/lib/actions";
import toast from "react-hot-toast";

export default function EmailVerificationPage({
  searchParams,
}: {
  searchParams: { redirect: string };
}) {
  const [formState, formAction] = useFormState(changeEmail, {
    success: null,
    message: "",
  });

  const { pending } = useFormStatus();

  useEffect(() => {
    if (formState.success === true) {
      toast.success(formState.message);
      setTimeout(() => window.location.replace("/email/verify"), 1000);
    }
    if (formState.success === false) {
      toast.error(formState.message);
    }
  }, [formState, searchParams.redirect]);

  return (
    <>
      <form
        action={formAction}
        className="flex flex-col items-center gap-6 bg-gray-800 p-8 rounded-lg w-full max-w-md border border-gray-600"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          Change Email
        </h1>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="email" className="font-medium">
            New Email:
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none invalid:border-red-800"
            placeholder="Email..."
            name="email"
            id="email"
            required
            autoFocus
            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
          />
        </div>

        <button
          disabled={pending}
          type="submit"
          className="rounded-md p-2 bg-blue-800 disabled:bg-slate-800"
        >
          Change Email
        </button>
      </form>
    </>
  );
}

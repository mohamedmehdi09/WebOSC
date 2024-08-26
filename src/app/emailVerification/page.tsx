"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { verifyEmail } from "@/lib/actions";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function EmailVerificationPage() {
  const [formState, formAction] = useFormState(verifyEmail, {
    success: null,
    message: "",
  });

  const { pending } = useFormStatus();

  const redirect = useSearchParams()?.get("redirect");

  useEffect(() => {
    if (formState.success === true) {
      toast.success(formState.message);
      setTimeout(() => window.location.replace(redirect || "/"), 1000);
    }
  }, [formState, redirect]);

  return (
    <div className="flex flex-1 items-center justify-center">
      {formState.success == null || formState.success == false ? (
        <form className="flex flex-col gap-6 md:w-1/3 w-full">
          <h1 className="text-xl sm:text-2xl font-bold text-center">
            verify email
          </h1>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="emailVerificationPhrase" className="font-medium">
              Pass Phrase
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none invalid:border-red-800"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              name="emailVerificationPhrase"
              id="emailVerificationPhrase"
              required
              autoFocus
              pattern="[a-zA-Z0-9\-]{10,}"
            />
          </div>
          <p className="text-red-500 w-full text-center">{formState.message}</p>

          <button
            disabled={pending}
            type="submit"
            formAction={formAction}
            className="rounded-md p-2 bg-blue-800 disabled:bg-slate-800"
          >
            verify email
          </button>
        </form>
      ) : (
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          email verified
        </h1>
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { verifyEmail } from "@/lib/actions";
import toast from "react-hot-toast";
import ResendEmailForm from "@/components/ResendEmailForm";

export default function EmailVerificationPage({
  searchParams,
}: {
  searchParams: { redirect: string };
}) {
  const [formState, formAction] = useFormState(verifyEmail, {
    success: null,
    message: "",
  });

  const { pending } = useFormStatus();

  useEffect(() => {
    if (formState.success === true) {
      toast.success(formState.message);
      setTimeout(
        () => window.location.replace(searchParams.redirect || "/"),
        1000
      );
    } else if (formState.success === false) {
      toast.error(formState.message);
    }
  }, [formState, searchParams.redirect]);

  return formState.success == null || formState.success == false ? (
    <>
      <form
        action={formAction}
        className="flex flex-col items-center gap-6 bg-gray-800 p-6 md:p-8 rounded-lg w-full max-w-md border border-gray-600 shadow-lg"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white">
          Verify your email
        </h1>
        <div className="w-full flex flex-col gap-3">
          <label htmlFor="emailVerificationPhrase" className="font-medium text-gray-200">
            Passphrase:
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-900 outline-none invalid:border-red-800 focus:border-blue-500"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            name="emailVerificationPhrase"
            id="emailVerificationPhrase"
            required
            autoFocus
            pattern="[a-zA-Z0-9\-]{10,}"
          />
        </div>
        <button
          disabled={pending}
          type="submit"
          className="rounded-md p-2 w-full bg-blue-700 hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold transition-colors duration-200"
        >
          Confirm
        </button>
      </form>
      <ResendEmailForm />
    </>
  ) : (
    <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mt-8">
      Email verified!
    </h1>
  );
}

"use client";

import { sendPasswordResetEmail } from "@/lib/actions";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [formState, formAction] = useFormState(sendPasswordResetEmail, {
    success: null,
    message: "",
  });
  const { pending } = useFormStatus();

  useEffect(() => {
    if (formState.success == null) return;
    if (formState.success) toast.success(formState.message, { duration: 5000 });
    else {
      toast.error(formState.message);
    }
  }, [formState]);
  return (
    <>
      <div className="flex flex-1 items-center justify-center p-4">
        {formState.success ? (
          <p className="text-center text-green-500">{formState.message}</p>
        ) : (
          <form
            className="flex flex-col items-center gap-6 bg-gray-800 p-8 rounded-lg w-full max-w-lg border border-gray-600"
            action={formAction}
          >
            <h1 className="text-3xl font-bold text-white">
              Send Password Reset Link
            </h1>
            <div className="w-full flex flex-col gap-2">
              <label className="font-medium text-white" htmlFor="email">
                <span className="text-red-500 mr-1">*</span>
                Email
              </label>
              <input
                className="w-full p-3 border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-400 outline-none invalid:border-red-800"
                type="email"
                name="email"
                id="email"
                required
                autoFocus
                placeholder="Email..."
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              />
            </div>

            <button
              disabled={pending}
              type="submit"
              className="w-full p-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 disabled:bg-gray-700"
            >
              Send Link
            </button>
          </form>
        )}
      </div>
    </>
  );
}

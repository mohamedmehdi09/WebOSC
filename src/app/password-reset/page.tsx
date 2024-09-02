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
    if (formState.success) {
      toast.success(formState.message, { duration: 5000 });
    } else {
      toast.error(formState.message);
    }
  }, [formState]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      {formState.success ? (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-md">
          <p className="text-center">{formState.message}</p>
        </div>
      ) : (
        <form
          className="flex flex-col items-center gap-6 bg-gray-800 p-8 rounded-lg w-full max-w-md border border-gray-600 shadow-lg"
          action={formAction}
        >
          <h1 className="text-2xl font-semibold text-white">
            Reset Your Password
          </h1>
          <div className="w-full flex flex-col gap-4">
            <div>
              <label
                className="block text-sm font-medium text-white"
                htmlFor="email"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                className="mt-1 w-full p-3 border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-600 invalid:border-red-800"
                type="email"
                name="email"
                id="email"
                required
                autoFocus
                placeholder="Enter your email"
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                aria-invalid={formState.success === false ? "true" : "false"}
                aria-describedby="email-error"
              />
              {formState.success === false && (
                <p id="email-error" className="mt-2 text-sm text-red-600">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            <button
              disabled={pending}
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              {pending ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

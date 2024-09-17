"use client";

import { sendPasswordResetEmail } from "@/lib/actions";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import { FormState } from "@/lib/types";

const initFormState: FormState = {
  success: null,
  redirect: null,
  message: null,
};

export default function SendPasswordResetEmailForm() {
  const [formState, formAction] = useFormState(
    sendPasswordResetEmail,
    initFormState,
  );

  const [toastID, setToastID] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (formState.success == null) return;
    if (formState.success) {
      toast.success(formState.message, { duration: 5000, id: toastID });
      setToastID(undefined);
    } else {
      toast.error(formState.message, { id: toastID });
      setToastID(undefined);
    }
  }, [formState]);

  return (
    <>
      <form
        className="flex flex-col items-center gap-6 bg-gray-800 p-8 rounded-lg w-full max-w-md border border-gray-600 shadow-lg"
        action={(form: FormData) => {
          const toastID = toast.loading("sending password reset email ...");
          setToastID(toastID);
          formAction(form);
        }}
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
              readOnly={formState.success === true}
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
            type="submit"
            disabled={formState.success === true || toastID !== undefined}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            {formState.success === true ? "Sent!" : "Send Reset Link"}
          </button>
        </div>
      </form>
      {formState.success === true && (
        <p className="mt-2 text-xl text-green-600">
          {formState.message} check your email!
        </p>
      )}
    </>
  );
}

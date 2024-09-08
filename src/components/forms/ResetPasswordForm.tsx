"use client";

import { resetPassword } from "@/lib/actions";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { FormState } from "@/lib/types";

const initFormState: FormState = {
  success: null,
  redirect: null,
  message: null,
};

export default function ResetPasswordForm({ passcode }: { passcode: string }) {
  const [formState, formAction] = useFormState(resetPassword, initFormState);

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [toastID, setToastID] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (formState.success == null) return;
    if (formState.success) {
      toast.success(formState.message, { id: toastID });
      setToastID(undefined);
      const redirect = formState.redirect;
      if (redirect) setTimeout(() => window.location.replace(redirect), 1000);
    } else {
      toast.error(formState.message, { id: toastID });
      setToastID(undefined);
    }
  }, [formState]);

  useEffect(() => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else {
      setPasswordError(null);
    }
  }, [password, confirmPassword]);

  return (
    <div className="flex flex-1 items-center justify-center p-4 bg-black min-h-screen">
      <form
        action={(form: FormData) => {
          form.append("reset_passcode", passcode);
          const toastID = toast.loading("Resetting Password...");
          setToastID(toastID);
          formAction(form);
        }}
        className="bg-gray-800 p-8 rounded-lg w-full max-w-lg shadow-lg flex flex-col items-center gap-6 border border-gray-600"
      >
        <h1 className="text-3xl font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
          Reset Your Password
        </h1>
        <p className="text-gray-400 text-center mb-4">
          Make sure your new password is strong and secure!
        </p>
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium text-white" htmlFor="password">
            <span className="text-red-500 mr-1">*</span>
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter new password"
              required
              minLength={8}
              title="Password should be at least 8 characters long"
              className={`w-full p-3 border rounded-md bg-gray-900 text-white placeholder-gray-400 outline-none focus:border-green-500 ${
                passwordError ? "border-red-600" : "border-gray-600"
              }`}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 text-gray-400" />
              ) : (
                <EyeIcon className="w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium text-white" htmlFor="confirmPassword">
            <span className="text-red-500 mr-1">*</span>
            Confirm Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm new password"
            required
            minLength={8}
            title="Password should match the previous one"
            className={`w-full p-3 border rounded-md bg-gray-900 text-white placeholder-gray-400 outline-none focus:border-green-500 ${
              passwordError ? "border-red-600" : "border-gray-600"
            }`}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        <button
          disabled={
            toastID !== undefined ||
            passwordError !== null ||
            formState.success == true
          }
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition duration-300 disabled:bg-gray-600"
          type="submit"
        >
          {toastID !== undefined ? "Processing..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

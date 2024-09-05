"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { resendVerificationEmail } from "@/lib/actions";
import toast from "react-hot-toast";

export default function ResendEmailForm() {
  const [formState, formAction] = useFormState(resendVerificationEmail, {
    success: null,
    message: "",
  });

  const [disableButton, setDisableButton] = useState(false);

  const { pending } = useFormStatus();

  useEffect(() => {
    if (formState.success === true) {
      toast.success(formState.message);
    }
    setDisableButton(true);
    setTimeout(() => {
      setDisableButton(false);
    }, 30000);
  }, [formState]);

  return (
    <form action={formAction} className="flex flex-col gap-6 lg:w-1/3 w-full">
      <button
        disabled={pending || disableButton}
        type="submit"
        className="text-blue-400 enabled:hover:underline disabled:text-gray-400"
      >
        Resend the verification email?
      </button>
    </form>
  );
}

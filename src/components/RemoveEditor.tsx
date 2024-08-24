"use client";
import { suspendEditor } from "@/lib/actions";
import { FormEvent, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";

export default function RemoveEditor({ editor_id }: { editor_id: string }) {
  const [formState, formAction] = useFormState(suspendEditor, {
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
    <form
      action={() => {
        const form = new FormData();
        form.append("editor_id", editor_id);
        formAction(form);
      }}
    >
      <button
        disabled={pending || formState.error === false}
        onClick={(event: FormEvent) => {
          if (pending) {
            event.preventDefault();
          }
        }}
        className="bg-red-700 hover:bg-red-800 disabled:bg-slate-700 px-4 py-2 rounded-md w-full"
        type="submit"
      >
        Remove
      </button>
    </form>
  );
}

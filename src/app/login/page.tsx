"use client";
import { authenticate } from "@/lib/actions";
import { FormEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";

export default function LoginPage() {
  const [state, formAction] = useFormState(authenticate, "");
  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        action={formAction}
        className="bg-white p-8 rounded shadow-md w-96 flex gap-4 flex-col"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email..."
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label
            className="block text-gray-700 font-medium mb-2 gap-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password..."
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>
        {state && <p className="text-red-500 text-xl text-center">{state}</p>}
        <LoginButton />
      </form>
    </main>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  const handleClick = (event: FormEvent) => {
    if (pending) {
      event.preventDefault();
    }
  };

  return (
    <button
      disabled={pending}
      className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-700 transition duration-300 disabled:bg-slate-500"
      type="submit"
      onClick={handleClick}
    >
      Login
    </button>
  );
}

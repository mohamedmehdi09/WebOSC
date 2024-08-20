"use client";
import { authenticate } from "@/lib/actions";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

export default function LoginPage() {
  const [state, formAction] = useFormState(authenticate, "");
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-1 items-center justify-center">
      <form
        action={formAction}
        className="flex flex-col items-center gap-8 bg-slate-800 p-8 rounded-md w-96"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email..."
            required
            autoFocus
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password..."
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              className="absolute right-0 m-4"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-4" />
              ) : (
                <EyeIcon className="w-4" />
              )}
            </button>
          </div>
        </div>
        {state && <p className="text-red-500 text-xl text-center">{state}</p>}
        <LoginButton />
        <Link className="font-normal underline text-blue-500" href={"/signup"}>
          create an account
        </Link>
      </form>
    </div>
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
      className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-md transition duration-300 disabled:bg-slate-500"
      type="submit"
      onClick={handleClick}
    >
      Login
    </button>
  );
}

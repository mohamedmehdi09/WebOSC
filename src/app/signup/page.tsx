"use client";
import { FormEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createUser } from "@/lib/actions";

export default function Signup() {
  const [errorMessage, dispatch] = useFormState(createUser, "");
  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        action={dispatch}
        className="bg-white p-8 rounded shadow-md w-96 flex gap-4 flex-col"
      >
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="name"
          >
            First Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="First Name"
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="lastname"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>
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
            placeholder="Email"
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="isMale"
          >
            Gender
          </label>
          <select
            name="isMale"
            className="w-full p-3 border border-gray-300 rounded"
          >
            <option value="true">Male</option>
            <option value="false">Female</option>
          </select>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-xl text-center">{errorMessage}</p>
        )}
        <SignupButton />
      </form>
    </main>
  );
}

function SignupButton() {
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
      Sign Up
    </button>
  );
}

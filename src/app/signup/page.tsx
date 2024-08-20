"use client";
import { FormEvent, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createUser } from "@/lib/actions";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SignupPage() {
  const [errorMessage, dispatch] = useFormState(createUser, "");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [middlename, setMiddlename] = useState("");

  return (
    <div className="flex flex-1 p-5 items-center justify-center">
      <form
        action={dispatch}
        className="bg-slate-800 p-8 rounded-md w-96 flex flex-col items-center gap-4"
      >
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium" htmlFor="name">
            First Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="First Name..."
            required
            autoFocus
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium" htmlFor="name">
            Middle Name
          </label>
          <input
            type="text"
            name="middlename"
            value={middlename}
            onChange={(e) => {
              setMiddlename(e.target.value);
            }}
            placeholder="Middle Name..."
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium" htmlFor="lastname">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            value={lastname}
            onChange={(e) => {
              setLastname(e.target.value);
            }}
            placeholder="Last Name..."
            required
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium" htmlFor="name">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={`${name}${middlename && `-${middlename[0]}`}${lastname && `-${lastname}`}`}
            placeholder="username (auto generated)"
            readOnly
            required
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email..."
            required
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
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium" htmlFor="isMale">
            Gender
          </label>
          <select
            name="isMale"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 outline-none"
          >
            <option value="true">Male</option>
            <option value="false">Female</option>
          </select>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-xl text-center">{errorMessage}</p>
        )}
        <SignupButton />
        <Link className="font-normal underline text-blue-500" href={"/login"}>
          already have an account?
        </Link>
      </form>
    </div>
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
      className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-md transition duration-300 disabled:bg-slate-500"
      type="submit"
      onClick={handleClick}
    >
      Sign Up
    </button>
  );
}

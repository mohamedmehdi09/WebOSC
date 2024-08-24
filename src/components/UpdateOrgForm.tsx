"use client";

import { useState } from "react";
// import { upadateOrg } from "@/lib/actions";
import { Organization } from "@prisma/client";
import { useFormStatus } from "react-dom";
import { FormEvent } from "react";

const UpdateOrgForm = ({ org }: { org: Organization }) => {
  const [nameEn, setNameEn] = useState(org.nameEn);
  const [nameAr, setNameAr] = useState(org.nameAr);
  const { pending } = useFormStatus();

  const handleClick = (event: FormEvent) => {
    if (pending) {
      event.preventDefault();
    }
  };

  const form = new FormData();

  return (
    <form
      className="flex flex-col gap-5 items-start w-1/4"
      //  action={upadateOrg}
    >
      <h1 className="text-2xl font-bold text-center">Update Organization</h1>
      <div className="flex flex-col w-full  gap-2">
        <label htmlFor="id" className="">
          identifier:
        </label>

        <input
          className="bg-red-50 p-4 rounded-lg cursor-not-allowed "
          value={org.org_id}
          name="id"
          id="id"
          required
          readOnly
        />
      </div>
      <div className="flex flex-col w-full  gap-2">
        <label htmlFor="nameEn" className="">
          English Name:
        </label>

        <input
          data-changed={nameEn !== org.nameEn}
          className="bg-red-50 p-4 rounded-lg data-[changed=true]:bg-red-300"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          name="nameEn"
          id="nameEn"
          required
        />
      </div>
      <div className="flex flex-col w-full  gap-2">
        <label htmlFor="nameAr" className="">
          Arabic Name:
        </label>

        <input
          className="bg-red-50 p-4 rounded-lg text-right"
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          name="nameAr"
          id="nameAr"
        />
      </div>
      <button
        disabled={pending || (org.nameAr === nameAr && org.nameEn === nameEn)}
        className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-700 transition duration-300 disabled:bg-slate-500"
        type="submit"
        onClick={handleClick}
      >
        Save Changes
      </button>
    </form>
  );
};

export default UpdateOrgForm;

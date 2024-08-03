"use server";

import { decodeJwt } from "jose";
import { cookies } from "next/headers";
type User = {
  user_id: string;
  name: string;
  lastname: string;
  isMale: boolean;
  email: string;
};

export default async function Home() {
  const token = cookies().get("token")?.value || "";
  const user = decodeJwt(token) as User;
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>User Information</h1>
        <ul>
          <li>
            <strong>User ID:</strong> {user?.user_id}
          </li>
          <li>
            <strong>Name:</strong> {user.name}
          </li>
          <li>
            <strong>Last Name:</strong> {user.lastname}
          </li>
          <li>
            <strong>Gender:</strong> {user.isMale ? "Male" : "Female"}
          </li>
          <li>
            <strong>Email:</strong> {user.email}
          </li>
        </ul>
      </div>
    </main>
  );
}

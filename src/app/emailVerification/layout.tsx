import { cookies } from "next/headers";
import { decode } from "jsonwebtoken";
import { TokenPayload } from "@/lib/types";
import Link from "next/link";

export default function EmailVerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("token")?.value;

  if (!token)
    return (
      <div className="flex flex-1 flex-col gap-5 items-center justify-center">
        <h1 className="text-xl sm:text-3xl font-bold text-center">
          must be logged in
        </h1>
        <Link
          href="/login"
          className="font-normal text-lg py-2 px-4 bg-blue-800 rounded-md hover:bg-blue-900"
        >
          Log In
        </Link>
      </div>
    );
  const user = decode(token) as TokenPayload;

  if (user.emailVerified)
    return (
      <div className="flex flex-1 flex-col gap-5 items-center justify-center">
        <h1 className="text-xl sm:text-3xl font-bold text-center">
          email verified
        </h1>
        <Link
          href="/"
          className="font-normal text-lg py-2 px-4 bg-blue-800 rounded-md hover:bg-blue-900"
        >
          Go Home
        </Link>
      </div>
    );

  return (
    <div className="flex flex-1 flex-col gap-5 items-center justify-center p-4">
      {children}
    </div>
  );
}

import { cookies } from "next/headers";
import { decode } from "jsonwebtoken";
import { TokenPayload } from "@/lib/types";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const getUser = async (user_id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      user_id: user_id,
    },
    include: { PrimaryEmail: true },
  });
  return user;
};

export default async function EmailVerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("token")?.value;

  if (!token)
    return (
      <div className="flex flex-1 flex-col gap-5 items-center justify-center p-4 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white">
          You must be logged in
        </h1>
        <Link
          href="/login"
          className="font-normal text-lg py-2 px-4 bg-blue-800 hover:bg-blue-900 rounded-md text-white transition-colors duration-200"
        >
          Log In
        </Link>
      </div>
    );
  
  const userToken = decode(token) as TokenPayload;

  if (userToken.emailVerified)
    return (
      <div className="flex flex-1 flex-col gap-5 items-center justify-center p-4 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white">
          Email verified
        </h1>
        <Link
          href="/"
          className="font-normal text-lg py-2 px-4 bg-blue-800 hover:bg-blue-900 rounded-md text-white transition-colors duration-200"
        >
          Go Home
        </Link>
      </div>
    );

  const user = await getUser(userToken.user_id);

  return (
    <div className="flex flex-1 flex-col gap-5 items-center justify-center p-4 md:p-8 bg-gray-900 text-gray-300">
      <p className="gap-2 flex flex-col md:flex-row items-center text-center md:text-left">
        <span>A verification passphrase was sent to your email:</span>
        <span className="text-gray-100 font-bold text-xl">
          {user?.PrimaryEmail?.email}
        </span>
      </p>
      {children}
      <p className="flex gap-2 text-gray-400">
        Made a mistake?
        <Link
          href={"/email/change"}
          className="text-blue-400 hover:underline disabled:text-gray-400 transition-colors duration-200"
        >
          Change email
        </Link>
      </p>
    </div>
  );
}

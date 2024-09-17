import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import { prisma } from "@/lib/prisma";

async function checkPasscode(reset_passcode: string) {
  const user = await prisma.passwordReset.findUnique({
    where: {
      reset_passcode: reset_passcode,
    },
    include: { user: true },
  });
  return user;
}

// Utility function to render the error message
function renderError(title: string, message: string) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-6">
      <div className="max-w-md w-full bg-gray-700 p-8 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-red-400">{title}</h2>
        <p className="mt-4 text-gray-200">{message}</p>
      </div>
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: { reset_passcode: string };
}) {
  const user = await checkPasscode(params.reset_passcode);

  if (!user) {
    return renderError(
      "Invalid Passcode",
      "The passcode you entered is invalid. Please check and try again!",
    );
  }

  if (user.status === "completed") {
    return renderError(
      "Passcode Already Used",
      "This passcode has already been used. Please request a new one!",
    );
  }

  if (user.status === "expired") {
    return renderError(
      "Passcode Expired",
      "This passcode has expired. Please request a new one!",
    );
  }

  return <ResetPasswordForm passcode={params.reset_passcode} />;
}

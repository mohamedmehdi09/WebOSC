import ResetPasswordForm from "@/components/ResetPasswordForm";
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
export default async function Page({
  params,
}: {
  params: { reset_passcode: string };
}) {
  const user = await checkPasscode(params.reset_passcode);
  if (!user) return <div>Invalid Passcode</div>;
  if (user.status == "completed") return <div>Passcode Already used</div>;
  if (user.status == "expired") return <div>Passcode Expired</div>;
  return (
    <>
      <ResetPasswordForm passcode={params.reset_passcode} />
    </>
  );
}

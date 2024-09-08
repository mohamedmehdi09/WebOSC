import SendPasswordResetEmailForm from "@/components/forms/SendRestPasswordEmailForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-black p-4">
      <SendPasswordResetEmailForm />
    </div>
  );
}

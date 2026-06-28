import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Reset password" };

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <AuthShell
      title="Set a new password"
      description="Choose a strong password you haven't used before."
    >
      <Suspense fallback={null}>
        <ResetPasswordForm token={token ?? ""} />
      </Suspense>
    </AuthShell>
  );
}

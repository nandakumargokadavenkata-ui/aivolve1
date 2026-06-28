import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyEmailStatus } from "@/components/auth/verify-email-status";

export const metadata: Metadata = { title: "Verify email" };

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token } = await searchParams;

  return (
    <AuthShell title="Email verification" description="Confirming your AIVolve account.">
      <VerifyEmailStatus token={token} />
    </AuthShell>
  );
}

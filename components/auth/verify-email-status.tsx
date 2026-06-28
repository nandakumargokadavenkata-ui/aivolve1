"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import { verifyEmail, resendVerificationEmail } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

type Status = "verifying" | "success" | "error";

export function VerifyEmailStatus({ token }: { token?: string }) {
  const [status, setStatus] = React.useState<Status>(token ? "verifying" : "error");
  const [errorMessage, setErrorMessage] = React.useState<string>(
    token ? "" : "This verification link is missing its token."
  );
  const [resendEmail, setResendEmail] = React.useState("");
  const [resendSent, setResendSent] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  React.useEffect(() => {
    if (!token) return;

    let isMounted = true;
    verifyEmail(token).then((result) => {
      if (!isMounted) return;
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.error);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setIsResending(true);
    await resendVerificationEmail(resendEmail);
    setIsResending(false);
    setResendSent(true);
  }

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <Loader2 className="size-6 animate-spin text-[var(--color-accent)]" aria-hidden="true" />
        <p className="text-sm text-[var(--color-text-muted)]">Verifying your email…</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <CheckCircle2 className="size-10 text-[var(--color-success)]" aria-hidden="true" />
        <p className="text-sm font-medium">Your email is verified.</p>
        <Button asChild variant="primary" className="mt-2 w-full">
          <Link href="/login">Continue to sign in</Link>
        </Button>
      </div>
    );
  }

  // status === "error"
  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <XCircle className="size-10 text-[var(--color-danger)]" aria-hidden="true" />
        <p className="text-sm text-[var(--color-text-muted)]">{errorMessage}</p>
      </div>

      {resendSent ? (
        <Alert variant="success">
          If that email is registered and unverified, a new link is on its way.
        </Alert>
      ) : (
        <form onSubmit={handleResend} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="resend-email">Resend verification link</Label>
            <Input
              id="resend-email"
              type="email"
              required
              placeholder="you@example.com"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline" className="w-full" isLoading={isResending}>
            <Mail className="size-4" aria-hidden="true" />
            Resend link
          </Button>
        </form>
      )}
    </div>
  );
}

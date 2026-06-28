"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Mail, CheckCircle2 } from "lucide-react";

export function RegisterForm() {
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterInput) {
    setFormError(null);
    setIsSubmitting(true);

    const result = await registerUser(values);

    if (!result.success) {
      setFormError(result.error);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) {
            setError(field as keyof RegisterInput, { message: messages[0] });
          }
        }
      }
      setIsSubmitting(false);
      return;
    }

    setSubmittedEmail(result.data.email);
    setIsSubmitting(false);
  }

  if (submittedEmail) {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--color-surface)]">
        {demoMode ? (
          <CheckCircle2 className="size-5 text-green-500" />
        ) : (
          <Mail className="size-5 text-[var(--color-accent)]" />
        )}
      </div>

      {demoMode ? (
        <>
          <p className="text-sm font-medium">Account created successfully 🎉</p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Demo Mode is enabled. You can now sign in immediately.
          </p>

          <Button asChild className="w-full">
            <a href="/login">Go to Login</a>
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm font-medium">Check your inbox</p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            We sent a verification link to{" "}
            <span className="font-medium text-[var(--color-text)]">
              {submittedEmail}
            </span>
            . Click it to activate your account.
          </p>
        </>
      )}
    </div>
  );
}

  return (
    <>
    {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
      <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-center text-sm text-amber-900">
        🚀 <strong>Hackathon Demo Mode</strong>
        <br />
        Email verification is disabled for evaluation.
      </div>
    )}
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {formError && <Alert variant="error">{formError}</Alert>}

      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          autoComplete="name"
          invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="name-error" className="text-xs text-[var(--color-danger)]">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-[var(--color-danger)]">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" className="text-xs text-[var(--color-danger)]">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p id="confirm-password-error" className="text-xs text-[var(--color-danger)]">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
        Create account
      </Button>
    </form>
    </>
  );
}

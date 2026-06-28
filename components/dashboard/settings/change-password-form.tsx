"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validations/settings";
import { changePassword } from "@/actions/settings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

export function ChangePasswordForm() {
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSaved, setIsSaved] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(values: ChangePasswordInput) {
    setFormError(null);
    setIsSaved(false);
    setIsSubmitting(true);

    const result = await changePassword(values);

    setIsSubmitting(false);
    if (!result.success) {
      setFormError(result.error);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) setError(field as keyof ChangePasswordInput, { message: messages[0] });
        }
      }
      return;
    }

    setIsSaved(true);
    reset();
  }

  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-semibold">Password</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Choose a strong password you haven&apos;t used before.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
          {formError && <Alert variant="error">{formError}</Alert>}
          {isSaved && <Alert variant="success">Password updated.</Alert>}

          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              invalid={!!errors.currentPassword}
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-xs text-[var(--color-danger)]">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                invalid={!!errors.newPassword}
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-xs text-[var(--color-danger)]">{errors.newPassword.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmNewPassword">Confirm new password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                invalid={!!errors.confirmNewPassword}
                {...register("confirmNewPassword")}
              />
              {errors.confirmNewPassword && (
                <p className="text-xs text-[var(--color-danger)]">{errors.confirmNewPassword.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Update password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

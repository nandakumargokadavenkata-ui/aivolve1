"use server";

import bcrypt from "bcryptjs";
import { GENERIC_RESET_MESSAGE } from "@/lib/constants";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { createToken, consumeToken } from "@/lib/tokens";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/lib/validations/auth";
import type { ActionResult } from "@/types";



export async function registerUser(input: RegisterInput): Promise<ActionResult<{ email: string }>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      success: false,
      error: "An account with this email already exists.",
      fieldErrors: { email: ["This email is already registered"] },
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      profile: { create: {} },
      placement: { create: {} },
    },
  });

  const token = await createToken(email, "EMAIL_VERIFICATION");
  await sendVerificationEmail(email, token);

  return { success: true, data: { email } };
}

export async function loginUser(
  input: LoginInput,
  callbackUrl?: string
): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return { success: true, data: { redirectTo: callbackUrl || "/dashboard" } };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.cause?.err?.message === "EMAIL_NOT_VERIFIED") {
        return {
          success: false,
          error: "Please verify your email before signing in. Check your inbox for the link.",
        };
      }
      return { success: false, error: "Incorrect email or password." };
    }
    throw error;
  }
}

export async function resendVerificationEmail(
  email: string
): Promise<ActionResult<undefined>> {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always behave the same way whether or not the account exists,
  // to avoid leaking which emails are registered.
  if (user && !user.emailVerified) {
    const token = await createToken(email, "EMAIL_VERIFICATION");
    await sendVerificationEmail(email, token);
  }

  return { success: true, data: undefined };
}

export async function verifyEmail(token: string): Promise<ActionResult<undefined>> {
  const result = await consumeToken(token, "EMAIL_VERIFICATION");

  if (!result.valid) {
    return {
      success: false,
      error: result.expired
        ? "This verification link has expired. Request a new one."
        : "This verification link is invalid.",
    };
  }

  await prisma.user.update({
    where: { email: result.email! },
    data: { emailVerified: new Date() },
  });

  return { success: true, data: undefined };
}

export async function requestPasswordReset(
  input: ForgotPasswordInput
): Promise<ActionResult<undefined>> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Enter a valid email address.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (user) {
    const token = await createToken(parsed.data.email, "PASSWORD_RESET");
    await sendPasswordResetEmail(parsed.data.email, token);
  }

  // Generic success message regardless — prevents account enumeration.
  return { success: true, data: undefined };
}

export async function resetPassword(
  input: ResetPasswordInput
): Promise<ActionResult<undefined>> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await consumeToken(parsed.data.token, "PASSWORD_RESET");

  if (!result.valid) {
    return {
      success: false,
      error: result.expired
        ? "This reset link has expired. Request a new one."
        : "This reset link is invalid.",
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.update({
    where: { email: result.email! },
    data: { passwordHash },
  });

  return { success: true, data: undefined };
}

export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}


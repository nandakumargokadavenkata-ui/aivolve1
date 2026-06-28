import { Resend } from "resend";
import { APP_NAME } from "@/lib/constants";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.EMAIL_FROM ?? `${APP_NAME} <onboarding@aivolve.app>`;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function emailShell(heading: string, bodyHtml: string, ctaLabel: string, ctaUrl: string) {
  return `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; background:#F8FAFC; padding:40px 0;">
      <div style="max-width:480px;margin:0 auto;background:#FFFFFF;border-radius:12px;border:1px solid #E2E8F0;padding:40px;">
        <p style="color:#06B6D4;font-weight:600;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;margin:0 0 16px;">${APP_NAME}</p>
        <h1 style="color:#0F172A;font-size:20px;margin:0 0 16px;">${heading}</h1>
        <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 24px;">${bodyHtml}</p>
        <a href="${ctaUrl}" style="display:inline-block;background:#0F172A;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:500;padding:12px 24px;border-radius:8px;">${ctaLabel}</a>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    </div>
  `;
}

/**
 * Sends transactional email if Resend is configured; otherwise logs the
 * link to the console so the flow is still testable in local development.
 */
async function send(to: string, subject: string, html: string, devLink: string) {
  if (!resend) {
    console.log(`[email:dev] ${subject} → ${to}\n${devLink}`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${APP_URL}/verify-email?token=${token}`;
  const html = emailShell(
    "Verify your email",
    "Confirm your email address to activate your AIVolve account and start tracking your engineering growth.",
    "Verify email",
    url
  );
  await send(email, `Verify your email for ${APP_NAME}`, html, url);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${APP_URL}/reset-password?token=${token}`;
  const html = emailShell(
    "Reset your password",
    "We received a request to reset your password. This link expires in 1 hour.",
    "Reset password",
    url
  );
  await send(email, `Reset your password — ${APP_NAME}`, html, url);
}

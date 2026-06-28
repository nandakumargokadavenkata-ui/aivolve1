import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour

export type TokenType = "EMAIL_VERIFICATION" | "PASSWORD_RESET";

function generateRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Creates a fresh token for the given email + type, clearing any
 * previous tokens of the same type so only one is ever valid at a time.
 */
export async function createToken(email: string, type: TokenType) {
  await prisma.verificationToken.deleteMany({
    where: { email, type },
  });

  const token = generateRawToken();
  const expires = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.verificationToken.create({
    data: { email, token, type, expires },
  });

  return token;
}

export async function consumeToken(token: string, type: TokenType) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record || record.type !== type) {
    return { valid: false as const, email: null };
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return { valid: false as const, email: null, expired: true as const };
  }

  await prisma.verificationToken.delete({ where: { token } });
  return { valid: true as const, email: record.email };
}

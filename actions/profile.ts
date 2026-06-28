"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import type { ActionResult } from "@/types";

function parseList(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function updateProfile(input: ProfileInput): Promise<ActionResult<undefined>> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in to update your profile." };
  }

  const { name, ...profileFields } = parsed.data;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    }),
    prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        bio: profileFields.bio || null,
        college: profileFields.college || null,
        branch: profileFields.branch || null,
        graduationYear: profileFields.graduationYear ?? null,
        location: profileFields.location || null,
        careerInterests: parseList(profileFields.careerInterests),
        goals: parseList(profileFields.goals),
        githubUrl: profileFields.githubUrl || null,
        linkedinUrl: profileFields.linkedinUrl || null,
        portfolioUrl: profileFields.portfolioUrl || null,
        avatarUrl: profileFields.avatarUrl || null,
      },
      create: {
        userId: session.user.id,
        bio: profileFields.bio || null,
        college: profileFields.college || null,
        branch: profileFields.branch || null,
        graduationYear: profileFields.graduationYear ?? null,
        location: profileFields.location || null,
        careerInterests: parseList(profileFields.careerInterests),
        goals: parseList(profileFields.goals),
        githubUrl: profileFields.githubUrl || null,
        linkedinUrl: profileFields.linkedinUrl || null,
        portfolioUrl: profileFields.portfolioUrl || null,
        avatarUrl: profileFields.avatarUrl || null,
      },
    }),
  ]);

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

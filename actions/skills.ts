"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { skillSchema, type SkillInput } from "@/lib/validations/skills";
import type { ActionResult } from "@/types";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("UNAUTHENTICATED");
  }
  return session.user.id;
}

export async function createSkill(input: SkillInput): Promise<ActionResult<{ id: string }>> {
  const parsed = skillSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const userId = await requireUserId();

  const skill = await prisma.skill.create({
    data: { ...parsed.data, notes: parsed.data.notes || null, userId },
  });

  revalidatePath("/dashboard/skills");
  revalidatePath("/dashboard");
  return { success: true, data: { id: skill.id } };
}

export async function updateSkill(
  id: string,
  input: SkillInput
): Promise<ActionResult<undefined>> {
  const parsed = skillSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const userId = await requireUserId();

  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { success: false, error: "Skill not found." };
  }

  await prisma.skill.update({
    where: { id },
    data: { ...parsed.data, notes: parsed.data.notes || null },
  });

  revalidatePath("/dashboard/skills");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

export async function deleteSkill(id: string): Promise<ActionResult<undefined>> {
  const userId = await requireUserId();

  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { success: false, error: "Skill not found." };
  }

  await prisma.skill.delete({ where: { id } });

  revalidatePath("/dashboard/skills");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

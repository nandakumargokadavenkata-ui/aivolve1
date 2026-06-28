"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  placementProgressSchema,
  mockInterviewSchema,
  type PlacementProgressInput,
  type MockInterviewInput,
} from "@/lib/validations/placement";
import type { ActionResult } from "@/types";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user.id;
}

/** Ensures a PlacementPrep row exists for the user (registration already creates one, but this is a safe fallback). */
async function ensurePlacementPrep(userId: string) {
  return prisma.placementPrep.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function updatePlacementProgress(
  input: PlacementProgressInput
): Promise<ActionResult<undefined>> {
  const parsed = placementProgressSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const userId = await requireUserId();
  await ensurePlacementPrep(userId);

  await prisma.placementPrep.update({
    where: { userId },
    data: parsed.data,
  });

  revalidatePath("/dashboard/placements");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

export async function createMockInterview(
  input: MockInterviewInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = mockInterviewSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const userId = await requireUserId();
  const placementPrep = await ensurePlacementPrep(userId);

  const interview = await prisma.mockInterview.create({
    data: {
      placementPrepId: placementPrep.id,
      title: parsed.data.title,
      date: new Date(parsed.data.date),
      score: parsed.data.score ?? null,
      feedback: parsed.data.feedback || null,
    },
  });

  await prisma.placementPrep.update({
    where: { userId },
    data: { mockInterviewsCount: { increment: 1 } },
  });

  revalidatePath("/dashboard/placements");
  return { success: true, data: { id: interview.id } };
}

export async function deleteMockInterview(id: string): Promise<ActionResult<undefined>> {
  const userId = await requireUserId();

  const interview = await prisma.mockInterview.findUnique({
    where: { id },
    include: { placementPrep: true },
  });

  if (!interview || interview.placementPrep.userId !== userId) {
    return { success: false, error: "Mock interview not found." };
  }

  await prisma.mockInterview.delete({ where: { id } });
  await prisma.placementPrep.update({
    where: { userId },
    data: { mockInterviewsCount: { decrement: 1 } },
  });

  revalidatePath("/dashboard/placements");
  return { success: true, data: undefined };
}

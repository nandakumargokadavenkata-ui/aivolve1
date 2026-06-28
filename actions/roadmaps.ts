"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roadmapSchema, milestoneSchema, type RoadmapInput, type MilestoneInput } from "@/lib/validations/roadmap";
import type { ActionResult } from "@/types";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user.id;
}

async function assertRoadmapOwnership(roadmapId: string, userId: string) {
  const roadmap = await prisma.roadmap.findUnique({ where: { id: roadmapId } });
  if (!roadmap || roadmap.userId !== userId) return null;
  return roadmap;
}

// ---------------------------------------------------------------------------
// Roadmaps
// ---------------------------------------------------------------------------

export async function createRoadmap(input: RoadmapInput): Promise<ActionResult<{ id: string }>> {
  const parsed = roadmapSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const userId = await requireUserId();

  const roadmap = await prisma.roadmap.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : null,
      userId,
    },
  });

  revalidatePath("/dashboard/roadmaps");
  revalidatePath("/dashboard");
  return { success: true, data: { id: roadmap.id } };
}

export async function deleteRoadmap(id: string): Promise<ActionResult<undefined>> {
  const userId = await requireUserId();
  const roadmap = await assertRoadmapOwnership(id, userId);
  if (!roadmap) return { success: false, error: "Roadmap not found." };

  await prisma.roadmap.delete({ where: { id } });

  revalidatePath("/dashboard/roadmaps");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

export async function createMilestone(
  roadmapId: string,
  input: MilestoneInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = milestoneSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const userId = await requireUserId();
  const roadmap = await assertRoadmapOwnership(roadmapId, userId);
  if (!roadmap) return { success: false, error: "Roadmap not found." };

  const lastMilestone = await prisma.milestone.findFirst({
    where: { roadmapId },
    orderBy: { order: "desc" },
  });

  const milestone = await prisma.milestone.create({
    data: {
      roadmapId,
      title: parsed.data.title,
      description: parsed.data.description || null,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      order: (lastMilestone?.order ?? -1) + 1,
    },
  });

  revalidatePath(`/dashboard/roadmaps/${roadmapId}`);
  revalidatePath("/dashboard/roadmaps");
  return { success: true, data: { id: milestone.id } };
}

export async function deleteMilestone(
  roadmapId: string,
  milestoneId: string
): Promise<ActionResult<undefined>> {
  const userId = await requireUserId();
  const roadmap = await assertRoadmapOwnership(roadmapId, userId);
  if (!roadmap) return { success: false, error: "Roadmap not found." };

  await prisma.milestone.delete({ where: { id: milestoneId } });

  revalidatePath(`/dashboard/roadmaps/${roadmapId}`);
  revalidatePath("/dashboard/roadmaps");
  return { success: true, data: undefined };
}

export async function toggleMilestoneComplete(
  roadmapId: string,
  milestoneId: string
): Promise<ActionResult<undefined>> {
  const userId = await requireUserId();
  const roadmap = await assertRoadmapOwnership(roadmapId, userId);
  if (!roadmap) return { success: false, error: "Roadmap not found." };

  const milestone = await prisma.milestone.findUnique({ where: { id: milestoneId } });
  if (!milestone || milestone.roadmapId !== roadmapId) {
    return { success: false, error: "Milestone not found." };
  }

  const isCompleting = milestone.status !== "COMPLETED";

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      status: isCompleting ? "COMPLETED" : "PENDING",
      completedAt: isCompleting ? new Date() : null,
    },
  });

  revalidatePath(`/dashboard/roadmaps/${roadmapId}`);
  revalidatePath("/dashboard/roadmaps");
  return { success: true, data: undefined };
}

/**
 * Moves a milestone up or down by swapping `order` with its neighbor.
 */
export async function reorderMilestone(
  roadmapId: string,
  milestoneId: string,
  direction: "up" | "down"
): Promise<ActionResult<undefined>> {
  const userId = await requireUserId();
  const roadmap = await assertRoadmapOwnership(roadmapId, userId);
  if (!roadmap) return { success: false, error: "Roadmap not found." };

  const milestones = await prisma.milestone.findMany({
    where: { roadmapId },
    orderBy: { order: "asc" },
  });

  const index = milestones.findIndex((m) => m.id === milestoneId);
  if (index === -1) return { success: false, error: "Milestone not found." };

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= milestones.length) {
    return { success: true, data: undefined }; // already at the edge, no-op
  }

  const current = milestones[index];
  const neighbor = milestones[swapIndex];

  await prisma.$transaction([
    prisma.milestone.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.milestone.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  revalidatePath(`/dashboard/roadmaps/${roadmapId}`);
  return { success: true, data: undefined };
}

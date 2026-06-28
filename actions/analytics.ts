"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types";

export async function recordAnalyticsSnapshot(): Promise<ActionResult<undefined>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }
  const userId = session.user.id;

  const [skillsCompleted, projectsCompleted, roadmaps] = await Promise.all([
    prisma.skill.count({ where: { userId, status: "PROFICIENT" } }),
    prisma.project.count({ where: { userId, status: "COMPLETED" } }),
    prisma.roadmap.findMany({ where: { userId }, include: { milestones: true } }),
  ]);

  const roadmapProgress =
    roadmaps.length === 0
      ? 0
      : Math.round(
          roadmaps.reduce((sum, r) => {
            if (r.milestones.length === 0) return sum;
            return sum + (r.milestones.filter((m) => m.status === "COMPLETED").length / r.milestones.length) * 100;
          }, 0) / roadmaps.length
        );

  await prisma.analyticsSnapshot.create({
    data: { userId, skillsCompleted, projectsCompleted, roadmapProgress },
  });

  revalidatePath("/dashboard/analytics");
  return { success: true, data: undefined };
}

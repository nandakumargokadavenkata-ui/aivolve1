import { prisma } from "@/lib/prisma";

export async function getRoadmaps(userId: string) {
  return prisma.roadmap.findMany({
    where: { userId },
    include: { milestones: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRoadmapWithMilestones(roadmapId: string, userId: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { id: roadmapId },
    include: { milestones: { orderBy: { order: "asc" } } },
  });

  if (!roadmap || roadmap.userId !== userId) return null;
  return roadmap;
}

export function calculateRoadmapProgress(milestones: { status: string }[]) {
  if (milestones.length === 0) return 0;
  const completed = milestones.filter((m) => m.status === "COMPLETED").length;
  return Math.round((completed / milestones.length) * 100);
}

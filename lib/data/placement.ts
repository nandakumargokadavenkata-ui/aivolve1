import { prisma } from "@/lib/prisma";

export async function getPlacementPrep(userId: string) {
  const placementPrep = await prisma.placementPrep.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: { mockInterviews: { orderBy: { date: "desc" } } },
  });

  return placementPrep;
}

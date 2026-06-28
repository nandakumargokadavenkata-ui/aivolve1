import { prisma } from "@/lib/prisma";

export async function getProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

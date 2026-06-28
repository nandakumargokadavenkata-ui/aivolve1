import { prisma } from "@/lib/prisma";

export async function getSkills(userId: string) {
  return prisma.skill.findMany({
    where: { userId },
    orderBy: [{ category: "asc" }, { createdAt: "desc" }],
  });
}

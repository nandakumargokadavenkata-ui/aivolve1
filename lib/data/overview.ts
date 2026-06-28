import { prisma } from "@/lib/prisma";

export async function getOverviewStats(userId: string) {
  const [skillsCount, roadmapsCount, projectsCount, achievementsCount] = await Promise.all([
    prisma.skill.count({ where: { userId } }),
    prisma.roadmap.count({ where: { userId } }),
    prisma.project.count({ where: { userId } }),
    prisma.achievement.count({ where: { userId } }),
  ]);

  return { skillsCount, roadmapsCount, projectsCount, achievementsCount };
}

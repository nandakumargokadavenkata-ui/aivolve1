import { prisma } from "@/lib/prisma";

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      _count: { select: { skills: true, projects: true, roadmaps: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPlatformStats() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, newUsersThisWeek, totalSkills, totalProjects, totalRoadmaps, totalAnnouncements] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.skill.count(),
      prisma.project.count(),
      prisma.roadmap.count(),
      prisma.announcement.count(),
    ]);

  return { totalUsers, newUsersThisWeek, totalSkills, totalProjects, totalRoadmaps, totalAnnouncements };
}

export async function getAllProjects() {
  return prisma.project.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });
}

export async function getAllAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
}

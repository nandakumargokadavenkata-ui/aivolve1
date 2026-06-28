import { prisma } from "@/lib/prisma";
import { SKILL_CATEGORY_LABELS } from "@/lib/constants";

export async function getAnalyticsData(userId: string) {
  const [skills, roadmaps, projects, snapshots] = await Promise.all([
    prisma.skill.findMany({ where: { userId }, select: { category: true, status: true, progress: true } }),
    prisma.roadmap.findMany({ where: { userId }, include: { milestones: true } }),
    prisma.project.findMany({ where: { userId }, select: { status: true } }),
    prisma.analyticsSnapshot.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      take: 30,
    }),
  ]);

  const skillDistribution = Object.entries(
    skills.reduce<Record<string, number>>((acc: Record<string, number>, skill: { category: string }) => {
      acc[skill.category] = (acc[skill.category] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({
    category: SKILL_CATEGORY_LABELS[category] ?? category,
    count: count as number,
  }));

  const roadmapCompletion = roadmaps.map((roadmap) => {
    const total = roadmap.milestones.length;
    const completed = roadmap.milestones.filter((m) => m.status === "COMPLETED").length;
    return {
      title: roadmap.title,
      progress: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  });

  const skillsProficient = skills.filter((s) => s.status === "PROFICIENT").length;
  const projectsCompleted = projects.filter((p) => p.status === "COMPLETED").length;

  const completionRates = {
    skills: skills.length === 0 ? 0 : Math.round((skillsProficient / skills.length) * 100),
    projects: projects.length === 0 ? 0 : Math.round((projectsCompleted / projects.length) * 100),
    roadmaps:
      roadmapCompletion.length === 0
        ? 0
        : Math.round(roadmapCompletion.reduce((sum, r) => sum + r.progress, 0) / roadmapCompletion.length),
  };

  const snapshotHistory = snapshots.map((s) => ({
    date: s.date.toISOString().slice(0, 10),
    skillsCompleted: s.skillsCompleted,
    roadmapProgress: s.roadmapProgress,
    projectsCompleted: s.projectsCompleted,
  }));

  return {
    skillDistribution,
    roadmapCompletion,
    completionRates,
    snapshotHistory,
    totals: { skills: skills.length, roadmaps: roadmaps.length, projects: projects.length },
  };
}

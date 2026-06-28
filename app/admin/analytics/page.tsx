import { redirect } from "next/navigation";
import { Users, Sparkles, FolderKanban, Map, Megaphone, UserPlus } from "lucide-react";
import { auth } from "@/lib/auth";
import { getPlatformStats } from "@/lib/data/admin";
import { StatCard } from "@/components/dashboard/stat-card";

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const stats = await getPlatformStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Platform analytics</h2>
        <p className="mt-1 text-[var(--color-text-muted)]">Aggregate activity across all accounts.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Users} label="Total users" value={stats.totalUsers} />
        <StatCard icon={UserPlus} label="New users (7 days)" value={stats.newUsersThisWeek} />
        <StatCard icon={Sparkles} label="Skills tracked" value={stats.totalSkills} />
        <StatCard icon={FolderKanban} label="Projects tracked" value={stats.totalProjects} />
        <StatCard icon={Map} label="Roadmaps created" value={stats.totalRoadmaps} />
        <StatCard icon={Megaphone} label="Announcements" value={stats.totalAnnouncements} />
      </div>
    </div>
  );
}

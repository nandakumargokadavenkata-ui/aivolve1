import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, Map, FolderKanban, Trophy, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { getOverviewStats } from "@/lib/data/overview";
import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome back{session.user.name ? `, ${session.user.name}` : ""}
        </h2>
        <p className="mt-1 text-[var(--color-text-muted)]">
          Here&apos;s where your skills, roadmaps, and projects stand today.
        </p>
      </div>

      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}

async function OverviewContent({ userId }: { userId: string }) {
  const stats = await getOverviewStats(userId);
  const isEmpty =
    stats.skillsCount === 0 &&
    stats.roadmapsCount === 0 &&
    stats.projectsCount === 0 &&
    stats.achievementsCount === 0;

  if (isEmpty) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Your dashboard is ready"
        description="Add your first skill or build a roadmap to start seeing your progress here."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="primary">
              <Link href="/dashboard/skills">
                Add a skill
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/roadmaps">Build a roadmap</Link>
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon={Sparkles} label="Skills tracked" value={stats.skillsCount} />
      <StatCard icon={Map} label="Active roadmaps" value={stats.roadmapsCount} />
      <StatCard icon={FolderKanban} label="Projects" value={stats.projectsCount} />
      <StatCard icon={Trophy} label="Achievements" value={stats.achievementsCount} />
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[92px]" />
      ))}
    </div>
  );
}

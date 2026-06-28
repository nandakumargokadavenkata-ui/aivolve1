import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BarChart3, Percent, Map, FolderKanban } from "lucide-react";
import { auth } from "@/lib/auth";
import { getAnalyticsData } from "@/lib/data/analytics";
import { StatCard } from "@/components/dashboard/stat-card";
import { SkillDistributionChart } from "@/components/dashboard/analytics/skill-distribution-chart";
import { RoadmapCompletionChart } from "@/components/dashboard/analytics/roadmap-completion-chart";
import { GrowthTrendChart } from "@/components/dashboard/analytics/growth-trend-chart";
import { RecordSnapshotButton } from "@/components/dashboard/analytics/record-snapshot-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Analytics</h2>
          <p className="mt-1 text-[var(--color-text-muted)]">
            Growth trends, completion rates, and where your effort is going.
          </p>
        </div>
        <RecordSnapshotButton />
      </div>

      <Suspense fallback={<Skeleton className="h-[400px]" />}>
        <AnalyticsContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}

async function AnalyticsContent({ userId }: { userId: string }) {
  const data = await getAnalyticsData(userId);
  const hasAnyData = data.totals.skills + data.totals.roadmaps + data.totals.projects > 0;

  if (!hasAnyData) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Nothing to analyze yet"
        description="Add skills, roadmaps, or projects, then come back here to see trends and completion rates."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Percent} label="Skill proficiency rate" value={`${data.completionRates.skills}%`} />
        <StatCard icon={Map} label="Avg. roadmap completion" value={`${data.completionRates.roadmaps}%`} />
        <StatCard icon={FolderKanban} label="Project completion rate" value={`${data.completionRates.projects}%`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skill distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {data.skillDistribution.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No skills tracked yet.</p>
            ) : (
              <SkillDistributionChart data={data.skillDistribution} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roadmap completion</CardTitle>
          </CardHeader>
          <CardContent>
            {data.roadmapCompletion.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No roadmaps yet.</p>
            ) : (
              <RoadmapCompletionChart data={data.roadmapCompletion} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Growth over time</CardTitle>
        </CardHeader>
        <CardContent>
          {data.snapshotHistory.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Record a snapshot to start tracking your trend over time.
            </p>
          ) : (
            <GrowthTrendChart data={data.snapshotHistory} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

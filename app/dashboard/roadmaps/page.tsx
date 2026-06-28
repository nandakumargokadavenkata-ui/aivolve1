import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Map } from "lucide-react";
import { auth } from "@/lib/auth";
import { getRoadmaps } from "@/lib/data/roadmaps";
import { RoadmapForm } from "@/components/dashboard/roadmaps/roadmap-form";
import { RoadmapCard } from "@/components/dashboard/roadmaps/roadmap-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default async function RoadmapsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Roadmaps</h2>
          <p className="mt-1 text-[var(--color-text-muted)]">
            Turn your goals into ordered milestones you can track.
          </p>
        </div>
        <RoadmapForm />
      </div>

      <Suspense fallback={<RoadmapsSkeleton />}>
        <RoadmapsContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}

async function RoadmapsContent({ userId }: { userId: string }) {
  const roadmaps = await getRoadmaps(userId);

  if (roadmaps.length === 0) {
    return (
      <EmptyState
        icon={Map}
        title="No roadmaps yet"
        description="Create a roadmap toward a goal — placement, a specialization, or a project — and break it into milestones."
        action={<RoadmapForm />}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {roadmaps.map((roadmap) => (
        <RoadmapCard key={roadmap.id} roadmap={roadmap} />
      ))}
    </div>
  );
}

function RoadmapsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-[160px]" />
      ))}
    </div>
  );
}

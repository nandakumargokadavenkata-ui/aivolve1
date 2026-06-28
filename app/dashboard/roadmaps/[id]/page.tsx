import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Map } from "lucide-react";
import { auth } from "@/lib/auth";
import { getRoadmapWithMilestones, calculateRoadmapProgress } from "@/lib/data/roadmaps";
import { MilestoneForm } from "@/components/dashboard/roadmaps/milestone-form";
import { MilestoneList } from "@/components/dashboard/roadmaps/milestone-list";
import { EmptyState } from "@/components/ui/empty-state";

interface RoadmapDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoadmapDetailPage({ params }: RoadmapDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const roadmap = await getRoadmapWithMilestones(id, session.user.id);
  if (!roadmap) notFound();

  const progress = calculateRoadmapProgress(roadmap.milestones);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/roadmaps"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to roadmaps
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{roadmap.title}</h2>
          {roadmap.description && (
            <p className="mt-1 max-w-xl text-[var(--color-text-muted)]">{roadmap.description}</p>
          )}
        </div>
        <MilestoneForm roadmapId={roadmap.id} />
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Overall progress</span>
          <span className="text-[var(--color-text-muted)]">{progress}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface)]">
          <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {roadmap.milestones.length === 0 ? (
        <EmptyState
          icon={Map}
          title="No milestones yet"
          description="Break this roadmap into ordered steps you can check off one by one."
          action={<MilestoneForm roadmapId={roadmap.id} />}
        />
      ) : (
        <MilestoneList roadmapId={roadmap.id} milestones={roadmap.milestones} />
      )}
    </div>
  );
}

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Briefcase } from "lucide-react";
import { auth } from "@/lib/auth";
import { getPlacementPrep } from "@/lib/data/placement";
import { PlacementProgressForm } from "@/components/dashboard/placements/progress-sliders";
import { MockInterviewForm } from "@/components/dashboard/placements/mock-interview-form";
import { MockInterviewList } from "@/components/dashboard/placements/mock-interview-list";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default async function PlacementsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Placement preparation</h2>
        <p className="mt-1 text-[var(--color-text-muted)]">
          Aptitude, DSA, core subjects, mock interviews, and resume — tracked together.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[220px]" />}>
        <PlacementContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}

async function PlacementContent({ userId }: { userId: string }) {
  const placementPrep = await getPlacementPrep(userId);

  return (
    <div className="space-y-8">
      <PlacementProgressForm
        initialValues={{
          aptitudeProgress: placementPrep.aptitudeProgress,
          dsaProgress: placementPrep.dsaProgress,
          coreSubjectsProgress: placementPrep.coreSubjectsProgress,
          resumeProgress: placementPrep.resumeProgress,
        }}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Mock interviews</h3>
            <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">
              {placementPrep.mockInterviewsCount} logged so far
            </p>
          </div>
          <MockInterviewForm />
        </div>

        {placementPrep.mockInterviews.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No mock interviews logged"
            description="Log your next mock interview to track scores and feedback over time."
            action={<MockInterviewForm />}
          />
        ) : (
          <MockInterviewList interviews={placementPrep.mockInterviews} />
        )}
      </div>
    </div>
  );
}

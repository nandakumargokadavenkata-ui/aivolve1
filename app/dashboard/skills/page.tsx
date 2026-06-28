import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { getSkills } from "@/lib/data/skills";
import { SkillForm } from "@/components/dashboard/skills/skill-form";
import { SkillsGrid } from "@/components/dashboard/skills/skills-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default async function SkillsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
          <p className="mt-1 text-[var(--color-text-muted)]">
            Track what you&apos;re learning, by category and progress.
          </p>
        </div>
        <SkillForm />
      </div>

      <Suspense fallback={<SkillsSkeleton />}>
        <SkillsContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}

async function SkillsContent({ userId }: { userId: string }) {
  const skills = await getSkills(userId);

  if (skills.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No skills tracked yet"
        description="Add your first skill to start tracking progress toward proficiency."
        action={<SkillForm />}
      />
    );
  }

  return <SkillsGrid skills={skills} />;
}

function SkillsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-[150px]" />
      ))}
    </div>
  );
}

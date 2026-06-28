import { Suspense } from "react";
import { redirect } from "next/navigation";
import { FolderKanban } from "lucide-react";
import { auth } from "@/lib/auth";
import { getProjects } from "@/lib/data/projects";
import { ProjectForm } from "@/components/dashboard/projects/project-form";
import { ProjectsGrid } from "@/components/dashboard/projects/projects-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          <p className="mt-1 text-[var(--color-text-muted)]">
            Every project from idea to ship, with stage, stack, and links.
          </p>
        </div>
        <ProjectForm />
      </div>

      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}

async function ProjectsContent({ userId }: { userId: string }) {
  const projects = await getProjects(userId);

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No projects tracked yet"
        description="Add a project to track its stage, stack, and links — from idea to shipped."
        action={<ProjectForm />}
      />
    );
  }

  return <ProjectsGrid projects={projects} />;
}

function ProjectsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-[190px]" />
      ))}
    </div>
  );
}

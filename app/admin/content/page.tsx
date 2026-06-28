import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAllProjects } from "@/lib/data/admin";
import { PROJECT_STATUS_LABELS } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { FolderKanban } from "lucide-react";

export default async function AdminContentPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const projects = await getAllProjects();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Content</h2>
        <p className="mt-1 text-[var(--color-text-muted)]">
          Platform-wide view of student projects, most recently updated first.
        </p>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No content yet"
          description="Projects students create will show up here for moderation."
        />
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <Card key={project.id} className="flex items-center justify-between p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{project.title}</p>
                  <Badge variant="outline">{PROJECT_STATUS_LABELS[project.status]}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                  {project.user.name ?? project.user.email}
                </p>
              </div>
              <DeleteProjectButton projectId={project.id} title={project.title} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

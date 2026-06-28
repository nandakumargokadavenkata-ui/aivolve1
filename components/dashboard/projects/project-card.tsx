"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2, GitBranch, ExternalLink } from "lucide-react";
import { deleteProject } from "@/actions/projects";
import { PROJECT_STATUS_LABELS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectForm, EditProjectTrigger } from "@/components/dashboard/projects/project-form";
import type { Project } from "@/types";

const STATUS_VARIANT: Record<string, "neutral" | "accent" | "success" | "warning"> = {
  PLANNING: "neutral",
  IN_PROGRESS: "accent",
  IN_REVIEW: "warning",
  COMPLETED: "success",
  ARCHIVED: "neutral",
};

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete project "${project.title}"?`)) return;
    setIsDeleting(true);
    await deleteProject(project.id);
    router.refresh();
  }

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium leading-tight">{project.title}</p>
          <Badge variant={STATUS_VARIANT[project.status]}>{PROJECT_STATUS_LABELS[project.status]}</Badge>
        </div>

        {project.description && (
          <p className="mt-2 line-clamp-2 text-sm text-[var(--color-text-muted)]">{project.description}</p>
        )}

        {project.technologies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="neutral">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border)] pt-3 mt-4">
          <div className="flex items-center gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                aria-label="Repository"
              >
                <GitBranch className="size-4" aria-hidden="true" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                aria-label="Live site"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-1">
            <ProjectForm project={project} trigger={<EditProjectTrigger />} />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              isLoading={isDeleting}
              aria-label="Delete project"
            >
              <Trash2 className="size-4 text-[var(--color-danger)]" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

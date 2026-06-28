"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PROJECT_STATUS_LABELS } from "@/lib/constants";
import { ProjectCard } from "@/components/dashboard/projects/project-card";
import type { Project } from "@/types";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [activeStatus, setActiveStatus] = React.useState<string>("ALL");

  const statusesPresent = React.useMemo(
    () => Array.from(new Set(projects.map((p) => p.status))),
    [projects]
  );

  const filtered = activeStatus === "ALL" ? projects : projects.filter((p) => p.status === activeStatus);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <FilterPill
          label={`All (${projects.length})`}
          active={activeStatus === "ALL"}
          onClick={() => setActiveStatus("ALL")}
        />
        {statusesPresent.map((status) => (
          <FilterPill
            key={status}
            label={PROJECT_STATUS_LABELS[status]}
            active={activeStatus === status}
            onClick={() => setActiveStatus(status)}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-[var(--color-primary)] text-white"
          : "bg-white text-[var(--color-text-muted)] border border-[var(--color-border)] hover:bg-[var(--color-surface)]"
      )}
    >
      {label}
    </button>
  );
}

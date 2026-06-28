"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Map } from "lucide-react";
import { deleteRoadmap } from "@/actions/roadmaps";
import { calculateRoadmapProgress } from "@/lib/data/roadmaps";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RoadmapWithMilestones } from "@/types";

export function RoadmapCard({ roadmap }: { roadmap: RoadmapWithMilestones }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const progress = calculateRoadmapProgress(roadmap.milestones);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (!window.confirm(`Delete "${roadmap.title}" and all its milestones?`)) return;
    setIsDeleting(true);
    await deleteRoadmap(roadmap.id);
    router.refresh();
  }

  return (
    <Card className="relative transition-shadow hover:shadow-[var(--shadow-md)]">
      <Link href={`/dashboard/roadmaps/${roadmap.id}`} className="block">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex size-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface)]">
              <Map className="size-4 text-[var(--color-accent)]" aria-hidden="true" />
            </div>
            <span className="text-xs font-medium text-[var(--color-text-muted)]">
              {roadmap.milestones.filter((m) => m.status === "COMPLETED").length}/{roadmap.milestones.length}
            </span>
          </div>

          <p className="mt-3 font-medium leading-tight">{roadmap.title}</p>
          {roadmap.description && (
            <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">{roadmap.description}</p>
          )}

          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface)]">
              <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">{progress}% complete</p>
          </div>
        </CardContent>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3"
        onClick={handleDelete}
        isLoading={isDeleting}
        aria-label="Delete roadmap"
      >
        <Trash2 className="size-4 text-[var(--color-danger)]" aria-hidden="true" />
      </Button>
    </Card>
  );
}

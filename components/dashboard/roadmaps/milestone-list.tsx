"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, Trash2, CheckCircle2, Circle, CircleDot } from "lucide-react";
import { toggleMilestoneComplete, deleteMilestone, reorderMilestone } from "@/actions/roadmaps";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/types";

const STATUS_ICON = {
  PENDING: Circle,
  IN_PROGRESS: CircleDot,
  COMPLETED: CheckCircle2,
};

export function MilestoneList({ roadmapId, milestones }: { roadmapId: string; milestones: Milestone[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  async function handleToggle(milestoneId: string) {
    setPendingId(milestoneId);
    await toggleMilestoneComplete(roadmapId, milestoneId);
    router.refresh();
    setPendingId(null);
  }

  async function handleDelete(milestoneId: string, title: string) {
    if (!window.confirm(`Remove milestone "${title}"?`)) return;
    setPendingId(milestoneId);
    await deleteMilestone(roadmapId, milestoneId);
    router.refresh();
    setPendingId(null);
  }

  async function handleReorder(milestoneId: string, direction: "up" | "down") {
    setPendingId(milestoneId);
    await reorderMilestone(roadmapId, milestoneId, direction);
    router.refresh();
    setPendingId(null);
  }

  return (
    <ol className="space-y-2">
      {milestones.map((milestone, index) => {
        const Icon = STATUS_ICON[milestone.status];
        const isDone = milestone.status === "COMPLETED";
        const isPending = pendingId === milestone.id;

        return (
          <li
            key={milestone.id}
            className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4"
          >
            <button
              type="button"
              onClick={() => handleToggle(milestone.id)}
              disabled={isPending}
              className="mt-0.5 shrink-0 disabled:opacity-50"
              aria-label={isDone ? "Mark as not completed" : "Mark as completed"}
            >
              <Icon
                className={cn("size-5", isDone ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]")}
                aria-hidden="true"
              />
            </button>

            <div className="min-w-0 flex-1">
              <p className={cn("text-sm font-medium", isDone && "text-[var(--color-text-muted)] line-through")}>
                {index + 1}. {milestone.title}
              </p>
              {milestone.description && (
                <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{milestone.description}</p>
              )}
              {milestone.dueDate && (
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Due {new Date(milestone.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex shrink-0 flex-col items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={isPending || index === 0}
                onClick={() => handleReorder(milestone.id, "up")}
                aria-label="Move up"
              >
                <ChevronUp className="size-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={isPending || index === milestones.length - 1}
                onClick={() => handleReorder(milestone.id, "down")}
                aria-label="Move down"
              >
                <ChevronDown className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              disabled={isPending}
              onClick={() => handleDelete(milestone.id, milestone.title)}
              aria-label="Delete milestone"
            >
              <Trash2 className="size-4 text-[var(--color-danger)]" aria-hidden="true" />
            </Button>
          </li>
        );
      })}
    </ol>
  );
}

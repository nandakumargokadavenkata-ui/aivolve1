"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteMockInterview } from "@/actions/placement";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MockInterview } from "@/types";

export function MockInterviewList({ interviews }: { interviews: MockInterview[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Remove "${title}"?`)) return;
    setPendingId(id);
    await deleteMockInterview(id);
    router.refresh();
    setPendingId(null);
  }

  return (
    <ul className="space-y-2">
      {interviews.map((interview) => (
        <li
          key={interview.id}
          className="flex items-start justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{interview.title}</p>
              {typeof interview.score === "number" && (
                <Badge variant={interview.score >= 70 ? "success" : "warning"}>{interview.score}/100</Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              {new Date(interview.date).toLocaleDateString()}
            </p>
            {interview.feedback && (
              <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">{interview.feedback}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            disabled={pendingId === interview.id}
            onClick={() => handleDelete(interview.id, interview.title)}
            aria-label="Delete mock interview"
          >
            <Trash2 className="size-4 text-[var(--color-danger)]" aria-hidden="true" />
          </Button>
        </li>
      ))}
    </ul>
  );
}

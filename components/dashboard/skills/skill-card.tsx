"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteSkill } from "@/actions/skills";
import { SKILL_CATEGORY_LABELS, SKILL_STATUS_LABELS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkillForm, EditSkillTrigger } from "@/components/dashboard/skills/skill-form";
import type { Skill } from "@/types";

const STATUS_VARIANT: Record<string, "neutral" | "accent" | "success"> = {
  NOT_STARTED: "neutral",
  LEARNING: "accent",
  PRACTICING: "accent",
  PROFICIENT: "success",
};

export function SkillCard({ skill }: { skill: Skill }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    if (!window.confirm(`Remove "${skill.name}" from your tracked skills?`)) return;
    setIsDeleting(true);
    await deleteSkill(skill.id);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium leading-tight">{skill.name}</p>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              {SKILL_CATEGORY_LABELS[skill.category]}
            </p>
          </div>
          <Badge variant={STATUS_VARIANT[skill.status]}>{SKILL_STATUS_LABELS[skill.status]}</Badge>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
            <span>Progress</span>
            <span>{skill.progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface)]">
            <div
              className="h-full rounded-full bg-[var(--color-accent)]"
              style={{ width: `${skill.progress}%` }}
            />
          </div>
        </div>

        {skill.notes && <p className="mt-3 text-sm text-[var(--color-text-muted)]">{skill.notes}</p>}

        <div className="mt-4 flex items-center justify-end gap-1 border-t border-[var(--color-border)] pt-3">
          <SkillForm skill={skill} trigger={<EditSkillTrigger />} />
          <Button variant="ghost" size="icon" onClick={handleDelete} isLoading={isDeleting} aria-label="Delete skill">
            <Trash2 className="size-4 text-[var(--color-danger)]" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

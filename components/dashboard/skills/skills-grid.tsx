"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/lib/constants";
import { SkillCard } from "@/components/dashboard/skills/skill-card";
import type { Skill } from "@/types";

export function SkillsGrid({ skills }: { skills: Skill[] }) {
  const [activeCategory, setActiveCategory] = React.useState<string>("ALL");

  const categoriesPresent = React.useMemo(
    () => Array.from(new Set(skills.map((s) => s.category))),
    [skills]
  );

  const filtered =
    activeCategory === "ALL" ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <FilterPill
          label={`All (${skills.length})`}
          active={activeCategory === "ALL"}
          onClick={() => setActiveCategory("ALL")}
        />
        {categoriesPresent.map((category) => (
          <FilterPill
            key={category}
            label={SKILL_CATEGORY_LABELS[category]}
            active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
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

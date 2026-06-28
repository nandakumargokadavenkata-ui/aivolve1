import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { Badge } from "@/components/ui/badge";

const MILESTONES = [
  { title: "Master DSA fundamentals", status: "done" as const },
  { title: "Build 2 full-stack projects", status: "done" as const },
  { title: "Contribute to an open-source repo", status: "active" as const },
  { title: "Complete 5 mock interviews", status: "pending" as const },
  { title: "Finalize resume & portfolio", status: "pending" as const },
];

const STATUS_ICON = {
  done: CheckCircle2,
  active: CircleDot,
  pending: Circle,
};

const STATUS_COLOR = {
  done: "text-[var(--color-success)]",
  active: "text-[var(--color-accent)]",
  pending: "text-[var(--color-text-muted)]",
};

export function RoadmapPreview() {
  return (
    <section id="roadmaps" className="bg-[var(--color-surface)] py-20 md:py-28">
      <div className="container-content grid items-center gap-14 md:grid-cols-2">
        <FadeIn>
          <Badge variant="accent">Growth roadmaps</Badge>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Turn "I should learn this" into an ordered plan
          </h2>
          <p className="mt-4 text-balance text-lg leading-relaxed text-[var(--color-text-muted)]">
            Build a roadmap toward any goal — placement, a specialization, or a
            project. Add milestones, reorder them as priorities shift, and
            watch your completion rate climb.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-md)]">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold">Placement readiness</p>
              <span className="text-xs font-medium text-[var(--color-text-muted)]">3 of 5 done</span>
            </div>
            <ol className="space-y-4">
              {MILESTONES.map((milestone, i) => {
                const Icon = STATUS_ICON[milestone.status];
                return (
                  <li key={milestone.title} className="flex items-start gap-3">
                    <Icon className={`mt-0.5 size-4 shrink-0 ${STATUS_COLOR[milestone.status]}`} aria-hidden="true" />
                    <span
                      className={
                        milestone.status === "done"
                          ? "text-sm text-[var(--color-text-muted)] line-through"
                          : "text-sm font-medium"
                      }
                    >
                      {i + 1}. {milestone.title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

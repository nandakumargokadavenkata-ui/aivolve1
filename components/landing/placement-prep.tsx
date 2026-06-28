import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/shared/fade-in";

const PREP_AREAS = [
  { label: "Aptitude", value: 88 },
  { label: "DSA", value: 71 },
  { label: "Core subjects", value: 60 },
  { label: "Mock interviews", value: 5, suffix: " completed" },
  { label: "Resume", value: 95 },
];

export function PlacementPrep() {
  return (
    <section id="placements" className="container-content py-20 md:py-28">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <Badge variant="accent" className="mx-auto">Placement preparation</Badge>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Walk into interviews knowing exactly where you stand
        </h2>
        <p className="mt-3 text-balance text-lg text-[var(--color-text-muted)]">
          Aptitude, DSA, core subjects, mock interviews, and your resume — tracked together, not scattered across five tabs.
        </p>
      </FadeIn>

      <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {PREP_AREAS.map((area, i) => (
          <FadeIn key={area.label} delay={i * 0.05}>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 text-center shadow-[var(--shadow-sm)]">
              <p className="text-2xl font-semibold text-[var(--color-primary)]">
                {area.value}
                {area.suffix ? "" : "%"}
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {area.label}
                {area.suffix ?? ""}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

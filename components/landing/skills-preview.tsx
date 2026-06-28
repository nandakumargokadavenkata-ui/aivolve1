import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/shared/fade-in";

const SKILLS = [
  { name: "React & Next.js", category: "Framework", progress: 78 },
  { name: "Data Structures", category: "Programming", progress: 64 },
  { name: "PostgreSQL", category: "Database", progress: 45 },
  { name: "Docker", category: "DevOps", progress: 30 },
];

export function SkillsPreview() {
  return (
    <section className="container-content py-20 md:py-28">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <FadeIn className="order-2 md:order-1">
          <div className="grid gap-3 sm:grid-cols-2">
            {SKILLS.map((skill) => (
              <div
                key={skill.name}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-tight">{skill.name}</p>
                  <Badge variant="outline">{skill.category}</Badge>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-accent)]"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">{skill.progress}% proficient</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="order-1 md:order-2">
          <Badge variant="accent">Skills tracker</Badge>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Know exactly where you stand on every skill
          </h2>
          <p className="mt-4 text-balance text-lg leading-relaxed text-[var(--color-text-muted)]">
            Organize skills by category, set a status from "not started" to
            "proficient," and track progress with a number — not a guess.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

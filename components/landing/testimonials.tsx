import { FadeIn } from "@/components/shared/fade-in";

const TESTIMONIALS = [
  {
    quote:
      "I went from a vague list of 'things to learn someday' to an actual roadmap I check off every week. The placement prep tracker alone got me interview-ready faster than I expected.",
    name: "Final-year, Computer Science",
    context: "Tier-1 engineering college",
  },
  {
    quote:
      "Having my skills, projects, and DSA progress in one dashboard instead of five spreadsheets changed how consistently I actually showed up.",
    name: "Third-year, Electronics & Communication",
    context: "State university",
  },
  {
    quote:
      "The roadmap builder made it obvious which milestone I was avoiding. Reordering it to be first was the push I needed.",
    name: "Second-year, Mechanical Engineering",
    context: "NIT",
  },
];

function Initials({ name }: { name: string }) {
  const initials = name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-semibold text-white">
      {initials}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-[var(--color-surface)] py-20 md:py-28">
      <div className="container-content">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Built around how students actually grow
          </h2>
        </FadeIn>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.05}>
              <figure className="flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                <blockquote className="flex-1 text-sm leading-relaxed text-[var(--color-text)]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Initials name={t.name} />
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{t.context}</p>
                  </div>
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

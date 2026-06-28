import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/shared/fade-in";

export function Hero() {
  return (
    <section className="container-content grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
      <FadeIn>
        <Badge variant="accent">Built for engineering students</Badge>

        <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
          Track your growth from first principles to placement-ready.
        </h1>

        <p className="mt-5 max-w-md text-balance text-lg leading-relaxed text-[var(--color-text-muted)]">
          AIVolve helps you learn engineering concepts, build real skills, and
          turn scattered effort into a roadmap you can actually see progress on.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="primary">
            <Link href="/register">
              Start tracking free
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#features">See how it works</a>
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-[var(--color-success)]" aria-hidden="true" />
            Free to start
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-[var(--color-success)]" aria-hidden="true" />
            No credit card
          </span>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <HeroVisual />
      </FadeIn>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-lg)]">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
        This week
      </p>

      <div className="mt-4 space-y-4">
        {[
          { label: "DSA practice", value: 82 },
          { label: "System design", value: 54 },
          { label: "Resume readiness", value: 91 },
        ].map((item) => (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="text-[var(--color-text-muted)]">{item.value}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface)]">
              <div
                className="h-full rounded-full bg-[var(--color-accent)]"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-5">
        {[
          { value: "14", label: "Skills tracked" },
          { value: "6", label: "Active goals" },
          { value: "92%", label: "On pace" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-lg font-semibold">{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

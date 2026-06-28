import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";

export function CTA() {
  return (
    <section className="container-content py-20 md:py-28">
      <FadeIn>
        <div className="rounded-[var(--radius-xl)] bg-[var(--color-primary)] px-8 py-16 text-center md:px-16">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Start tracking your growth today
          </h2>
          <p className="mx-auto mt-3 max-w-md text-balance text-[var(--color-border)]">
            Free to join. No credit card required. Built for engineering students who want to see real progress.
          </p>
          <Button asChild size="lg" variant="accent" className="mt-8">
            <Link href="/register">
              Create your account
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}

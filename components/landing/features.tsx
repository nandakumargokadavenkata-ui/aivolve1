import { Sparkles, Map, FolderKanban, Briefcase, BarChart3, Trophy } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Skills tracker",
    description: "Log every skill you're learning, by category, with progress that actually updates.",
  },
  {
    icon: Map,
    title: "Growth roadmaps",
    description: "Turn vague goals into ordered milestones you can reorder and check off.",
  },
  {
    icon: FolderKanban,
    title: "Project tracker",
    description: "Track every project from idea to shipped, with stages, stack, and repo links.",
  },
  {
    icon: Briefcase,
    title: "Placement prep",
    description: "Aptitude, DSA, core subjects, mock interviews, and resume — all in one view.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "See weekly trends, completion rates, and where your effort is actually going.",
  },
  {
    icon: Trophy,
    title: "Achievements",
    description: "Milestones worth celebrating, tracked automatically as you hit them.",
  },
];

export function Features() {
  return (
    <section id="features" className="container-content py-20 md:py-28">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Everything you need to grow with intention
        </h2>
        <p className="mt-3 text-balance text-lg text-[var(--color-text-muted)]">
          One place for the skills, projects, and prep that actually move your career forward.
        </p>
      </FadeIn>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <FadeIn key={feature.title} delay={i * 0.05}>
            <Card className="h-full transition-shadow hover:shadow-[var(--shadow-md)]">
              <CardHeader>
                <div className="mb-1 flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface)]">
                  <feature.icon className="size-5 text-[var(--color-accent)]" aria-hidden="true" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

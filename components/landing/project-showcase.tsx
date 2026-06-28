import { GitBranch, ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

const PROJECTS = [
  {
    title: "Campus Marketplace",
    description: "A peer-to-peer marketplace for students to buy and sell textbooks and gear.",
    stack: ["Next.js", "PostgreSQL", "Stripe"],
    status: "Completed",
  },
  {
    title: "Smart Attendance",
    description: "Face-recognition based attendance system for classroom deployment.",
    stack: ["Python", "OpenCV", "Flask"],
    status: "In review",
  },
  {
    title: "DevTracker CLI",
    description: "A terminal tool that summarizes your git activity into a weekly report.",
    stack: ["Node.js", "TypeScript"],
    status: "In progress",
  },
];

export function ProjectShowcase() {
  return (
    <section className="bg-[var(--color-surface)] py-20 md:py-28">
      <div className="container-content">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Projects that show your work, not just your resume
          </h2>
          <p className="mt-3 text-balance text-lg text-[var(--color-text-muted)]">
            Track every project from idea to ship — stage, stack, and links, all in one card.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <FadeIn key={project.title} delay={i * 0.05}>
              <Card className="flex h-full flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle>{project.title}</CardTitle>
                    <Badge variant="outline">{project.status}</Badge>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <Badge key={tech} variant="neutral">
                      {tech}
                    </Badge>
                  ))}
                </CardContent>
                <CardFooter className="gap-3 text-[var(--color-text-muted)]">
                  <GitBranch className="size-4" aria-hidden="true" />
                  <ExternalLink className="size-4" aria-hidden="true" />
                </CardFooter>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

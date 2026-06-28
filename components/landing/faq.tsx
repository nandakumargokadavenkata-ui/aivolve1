import { FadeIn } from "@/components/shared/fade-in";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Is AIVolve free to use?",
    answer:
      "Yes — creating an account, tracking skills, building roadmaps, and logging projects are all free. We may introduce optional paid features later, but the core tracking experience stays free for students.",
  },
  {
    question: "Do I need to be a CS student to use this?",
    answer:
      "Not at all. AIVolve is built for engineering students across branches — mechanical, electrical, civil, ECE, and more — who want to track skills, projects, and placement prep in one place.",
  },
  {
    question: "Can I track non-technical skills too?",
    answer:
      "Yes. Skills are organized by category, including a dedicated 'Soft Skills' category alongside programming, frameworks, databases, DevOps, and core engineering subjects.",
  },
  {
    question: "What happens to my data if I stop using it?",
    answer:
      "Your data stays in your account and is never shared or sold. You can export or delete it at any time from your account settings.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "AIVolve is a responsive web app that works well on mobile browsers today. A dedicated mobile app is on our roadmap.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="container-content py-20 md:py-28">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Frequently asked questions
        </h2>
      </FadeIn>

      <FadeIn delay={0.05} className="mx-auto mt-12 max-w-2xl">
        <Accordion type="single" collapsible className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-6">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </FadeIn>
    </section>
  );
}

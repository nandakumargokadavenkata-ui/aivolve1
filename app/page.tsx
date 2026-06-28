import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { RoadmapPreview } from "@/components/landing/roadmap-preview";
import { SkillsPreview } from "@/components/landing/skills-preview";
import { ProjectShowcase } from "@/components/landing/project-showcase";
import { PlacementPrep } from "@/components/landing/placement-prep";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <RoadmapPreview />
        <SkillsPreview />
        <ProjectShowcase />
        <PlacementPrep />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

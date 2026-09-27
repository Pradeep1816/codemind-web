import type { Metadata } from "next"
import { CallToActionSection } from "@/features/landing/components/call-to-action-section"
import { FeaturesSection } from "@/features/landing/components/features-section"
import { HeroSection } from "@/features/landing/components/hero-section"
import { LandingFooter } from "@/features/landing/components/landing-footer"
import { LandingHeader } from "@/features/landing/components/landing-header"
import { SecuritySection } from "@/features/landing/components/security-section"
import { TokenEfficiencySection } from "@/features/landing/components/token-efficiency-section"
import { UseCasesSection } from "@/features/landing/components/use-cases-section"
import { WorkflowSection } from "@/features/landing/components/workflow-section"

export const metadata: Metadata = {
  title: "Codexa — Understand every codebase",
  description:
    "Codexa turns repositories into searchable, source-linked engineering knowledge.",
}

export default function HomePage() {
  return (
    <main className="min-h-svh overflow-x-clip bg-[#f7f8fa] text-slate-950">
      <LandingHeader />
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[48rem] bg-[radial-gradient(circle_at_70%_12%,rgba(99,102,241,0.16),transparent_30%),radial-gradient(circle_at_18%_24%,rgba(16,185,129,0.10),transparent_24%)]"
        />
        <HeroSection />
      </div>
      <FeaturesSection />
      <UseCasesSection />
      <TokenEfficiencySection />
      <WorkflowSection />
      <SecuritySection />
      <CallToActionSection />
      <LandingFooter />
    </main>
  )
}

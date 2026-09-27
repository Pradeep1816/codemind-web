import type { Metadata } from "next"
import { CallToActionSection } from "@/features/landing/components/call-to-action-section"
import { LandingFooter } from "@/features/landing/components/landing-footer"
import { LandingHeader } from "@/features/landing/components/landing-header"
import { TokenEfficiencySection } from "@/features/landing/components/token-efficiency-section"

export const metadata: Metadata = {
  title: "Token-efficient repository context",
  description:
    "Learn how Codexa uses reusable repository knowledge and focused source evidence to reduce repeated AI context.",
}

export default function TokenEfficiencyPage() {
  return (
    <main className="min-h-svh overflow-x-clip bg-[#f7f8fa] text-slate-950">
      <LandingHeader />
      <TokenEfficiencySection />
      <CallToActionSection />
      <LandingFooter />
    </main>
  )
}

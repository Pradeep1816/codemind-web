import Link from "next/link"
import { ArrowRight, Check, Sparkles } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import styles from "./hero-section.module.css"
import { ProductPreview } from "./product-preview"

export function HeroSection() {
  return (
    <section className="relative isolate mx-auto grid max-w-7xl gap-14 overflow-hidden px-6 pb-24 pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:overflow-visible lg:px-8 lg:pb-32 lg:pt-24">
      <div aria-hidden="true" className={styles.backdrop}>
        <div className={styles.grid} />
        <div className={`${styles.orb} ${styles.primaryOrb}`} />
        <div className={`${styles.orb} ${styles.secondaryOrb}`} />
        <div className={`${styles.orb} ${styles.accentOrb}`} />
      </div>
      <div className="relative z-10 max-w-3xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm text-slate-600 shadow-sm backdrop-blur">
          <Sparkles aria-hidden="true" className="size-4 text-indigo-600" />
          Repository intelligence for engineering teams
        </div>
        <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
          Understand the codebase behind every decision.
        </h1>
        <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-slate-600 sm:text-xl">
          Codexa converts repositories into a source-linked knowledge graph,
          so your team can find business rules, trace workflows, and navigate
          unfamiliar systems with confidence.
        </p>
        <div className="mt-9 flex">
          <Link
            className={buttonVariants({
              className:
                "h-12 gap-2 px-6 text-base shadow-lg shadow-slate-950/10",
            })}
            href="/register"
          >
            Start with your repository
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
          {[
            "Source-linked results",
            "Incremental indexing",
            "Organization permissions",
          ].map((benefit) => (
            <span className="flex items-center gap-2" key={benefit}>
              <Check aria-hidden="true" className="size-4 text-emerald-600" />
              {benefit}
            </span>
          ))}
        </div>
      </div>

      <ProductPreview />
    </section>
  )
}

import Link from "next/link"
import { CodexaLogo } from "@/components/brand/codexa-logo"

const productLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#use-cases", label: "Use cases" },
  { href: "/token-efficiency", label: "Token efficiency" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#security", label: "Security" },
] as const

const workspaceLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Sign in" },
  { href: "/register", label: "Create workspace" },
] as const

const plannedResources = ["Documentation", "API reference", "Architecture guide"]

export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 lg:px-8 lg:pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-[1.45fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-sm sm:col-span-2 lg:col-span-1">
            <Link
              aria-label="Codexa home"
              className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
              href="/"
            >
              <CodexaLogo tone="inverse" />
            </Link>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              Repository intelligence that connects business logic,
              architecture, and workflows to source-level evidence.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]"
              />
              In active development
            </div>
          </div>

          <FooterLinks label="Product" links={productLinks} />
          <FooterLinks label="Workspace" links={workspaceLinks} />

          <nav aria-label="Planned resources">
            <h2 className="text-sm font-semibold text-white">Resources</h2>
            <ul className="mt-5 space-y-3.5">
              {plannedResources.map((resource) => (
                <li
                  className="flex items-center justify-between gap-3 text-sm"
                  key={resource}
                >
                  <span>{resource}</span>
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    Soon
                  </span>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-5 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Codexa. Built for source-aware engineering.</p>
          <div
            aria-label="Planned legal pages"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-500"
          >
            <span>Privacy · Coming soon</span>
            <span>Terms · Coming soon</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLinks({
  label,
  links,
}: {
  label: string
  links: ReadonlyArray<{ href: string; label: string }>
}) {
  return (
    <nav aria-label={`${label} links`}>
      <h2 className="text-sm font-semibold text-white">{label}</h2>
      <ul className="mt-5 space-y-3.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="text-sm transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

import Link from "next/link"
import { CodexaLogo } from "@/components/brand/codexa-logo"
import { buttonVariants } from "@/components/ui/button"
import { MobileNavigation } from "@/features/landing/components/mobile-navigation"
import { landingNavigation } from "@/features/landing/constants/landing-navigation"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#f7f8fa]/90 shadow-sm shadow-slate-950/[0.03] backdrop-blur-xl supports-[backdrop-filter]:bg-[#f7f8fa]/75">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          aria-label="Codexa home"
          className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4"
          href="/"
        >
          <CodexaLogo />
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 text-sm text-slate-600 lg:flex"
        >
          {landingNavigation.map((item) => (
            <Link
              className="transition-colors hover:text-slate-950"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            className={buttonVariants({
              className: "h-10 px-4",
              variant: "ghost",
            })}
            href="/login"
          >
            Sign in
          </Link>
          <Link
            className={buttonVariants({
              className: "h-10 px-4",
            })}
            href="/register"
          >
            Create workspace
          </Link>
        </div>

        <MobileNavigation />
      </div>
    </header>
  )
}

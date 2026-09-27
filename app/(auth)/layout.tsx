import Link from "next/link"
import type { ReactNode } from "react"
import { CodexaLogo } from "@/components/brand/codexa-logo"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 px-6 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex flex-col items-center text-center">
          <Link
            aria-label="Codexa home"
            className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4"
            href="/"
          >
            <CodexaLogo size="lg" />
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Turn repositories into searchable engineering knowledge.
          </p>
        </div>
        {children}
      </div>
    </main>
  )
}

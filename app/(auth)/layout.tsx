import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 px-6 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <p className="text-lg font-semibold tracking-tight">CodeMind</p>
          <p className="text-sm text-muted-foreground">
            Turn repositories into searchable engineering knowledge.
          </p>
        </div>
        {children}
      </div>
    </main>
  )
}

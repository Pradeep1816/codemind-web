import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 px-6 py-12">
      <div className="w-full max-w-md">{children}</div>
    </main>
  )
}

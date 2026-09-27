import type { ReactNode } from "react"
import { RequireAuth } from "@/features/auth/components/require-auth"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <RequireAuth>
      <div className="min-h-svh bg-background">{children}</div>
    </RequireAuth>
  )
}

"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/features/auth/stores/auth.store"

interface RequireAuthProps {
  children: ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter()
  const status = useAuthStore((state) => state.status)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [router, status])

  if (status !== "authenticated") {
    return (
      <main className="grid min-h-svh place-items-center">
        <p className="text-sm text-muted-foreground">Loading workspace…</p>
      </main>
    )
  }

  return children
}

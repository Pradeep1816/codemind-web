"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logout } from "@/features/auth/api/auth-client"
import { useAuthStore } from "@/features/auth/stores/auth.store"

export function LogoutButton() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const accessToken = useAuthStore((state) => state.accessToken)
  const clearSession = useAuthStore((state) => state.clearSession)

  async function handleLogout() {
    if (!accessToken || isPending) {
      return
    }

    setIsPending(true)

    try {
      await logout(accessToken)
    } finally {
      clearSession()
      router.replace("/login")
    }
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleLogout}
      type="button"
      variant="outline"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </Button>
  )
}

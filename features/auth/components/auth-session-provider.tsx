"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { refreshSession } from "@/features/auth/api/auth-client"
import { useAuthStore } from "@/features/auth/stores/auth.store"

interface AuthSessionProviderProps {
  children: ReactNode
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const initialized = useRef(false)
  const clearSession = useAuthStore((state) => state.clearSession)
  const setSession = useAuthStore((state) => state.setSession)

  useEffect(() => {
    if (initialized.current) {
      return
    }

    initialized.current = true

    void refreshSession()
      .then(setSession)
      .catch(clearSession)
  }, [clearSession, setSession])

  return children
}

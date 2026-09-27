"use client"

import { useState, type ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { AuthSessionProvider } from "@/features/auth/components/auth-session-provider"
import { createQueryClient } from "@/lib/query-client"

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </QueryClientProvider>
  )
}

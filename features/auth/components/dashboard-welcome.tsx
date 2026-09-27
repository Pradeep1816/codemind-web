"use client"

import { LogoutButton } from "@/features/auth/components/logout-button"
import { useAuthStore } from "@/features/auth/stores/auth.store"

export function DashboardWelcome() {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return null
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 py-8">
      <header className="flex items-center justify-between border-b pb-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">CodeMind</p>
          <h1 className="text-xl font-semibold">{user.organization.name}</h1>
        </div>
        <LogoutButton />
      </header>
      <section className="flex flex-1 items-center justify-center py-16 text-center">
        <div className="max-w-xl space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Signed in as {user.email}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Welcome, {user.name}
          </h2>
          <p className="text-muted-foreground">
            Authentication is ready. Repository management is the next frontend
            module.
          </p>
        </div>
      </section>
    </main>
  )
}

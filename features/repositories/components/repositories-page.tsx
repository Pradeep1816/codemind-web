"use client"

import Link from "next/link"
import { CodexaLogo } from "@/components/brand/codexa-logo"
import { LogoutButton } from "@/features/auth/components/logout-button"
import { useAuthStore } from "@/features/auth/stores/auth.store"
import { CreateRepositoryForm } from "@/features/repositories/components/create-repository-form"
import { RepositoryList } from "@/features/repositories/components/repository-list"

export function RepositoriesPage() {
  const status = useAuthStore((state) => state.status)
  const user = useAuthStore((state) => state.user)
  const permissions = user?.permissions
  const canCreate =
    permissions === undefined || permissions.includes("repository.create")

  return (
    <main className="mx-auto min-h-svh w-full max-w-7xl px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-2">
          <Link
            aria-label="Codexa home"
            className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4"
            href="/"
          >
            <CodexaLogo size="sm" />
          </Link>
          <h1 className="text-xl font-semibold">
            {user?.organization.name ?? "Workspace"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user?.email}
          </span>
          <LogoutButton />
        </div>
      </header>

      <section className="space-y-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Repositories
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect source repositories for indexing and code intelligence.
            </p>
          </div>
          <CreateRepositoryForm canCreate={canCreate} />
        </div>
        <RepositoryList enabled={status === "authenticated"} />
      </section>
    </main>
  )
}

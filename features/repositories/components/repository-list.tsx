"use client"

import { GitBranch, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRepositories } from "@/features/repositories/hooks/use-repositories"
import type { Repository } from "@/features/repositories/schemas/repository.schema"
import { ApiError } from "@/lib/api/api-error"

interface RepositoryListProps {
  enabled: boolean
}

export function RepositoryList({ enabled }: RepositoryListProps) {
  const repositories = useRepositories(enabled)

  if (repositories.isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            className="h-44 animate-pulse rounded-xl bg-muted"
            key={item}
          />
        ))}
      </div>
    )
  }

  if (repositories.isError) {
    const message =
      repositories.error instanceof ApiError
        ? repositories.error.message
        : "Unable to load repositories."

    return (
      <Card>
        <CardHeader>
          <CardTitle>Repositories could not be loaded</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            disabled={repositories.isFetching}
            onClick={() => void repositories.refetch()}
            type="button"
            variant="outline"
          >
            <RefreshCw />
            Try again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (repositories.data.data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-6 py-16 text-center">
        <GitBranch className="mx-auto mb-4 size-8 text-muted-foreground" />
        <h2 className="font-semibold">No repositories yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first repository to begin indexing its code.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {repositories.data.data.map((repository) => (
        <RepositoryCard key={repository.id} repository={repository} />
      ))}
    </div>
  )
}

function RepositoryCard({ repository }: { repository: Repository }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-lg bg-muted p-2">
              <GitBranch className="size-4" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate">{repository.name}</CardTitle>
              <CardDescription className="capitalize">
                {repository.provider}
              </CardDescription>
            </div>
          </div>
          <span
            className={
              repository.status === "active"
                ? "rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
            }
          >
            {repository.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="truncate text-sm text-muted-foreground" title={repository.remoteUrl}>
          {repository.remoteUrl}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <GitBranch className="size-4 text-muted-foreground" />
          <span>{repository.defaultBranch ?? "Branch not synced"}</span>
        </div>
      </CardContent>
    </Card>
  )
}

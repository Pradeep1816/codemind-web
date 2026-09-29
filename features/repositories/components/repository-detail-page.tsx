"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowLeft, GitBranch, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FormError } from "@/features/auth/components/form-error"
import { LogoutButton } from "@/features/auth/components/logout-button"
import { useAuthStore } from "@/features/auth/stores/auth.store"
import { KnowledgePanel } from "@/features/knowledge/components/knowledge-panel"
import {
  useIndexJobs,
  useRepository,
  useRepositoryBranches,
  useRepositoryHealth,
  useStartIndexJob,
  useSynchronizeBranches,
} from "@/features/repositories/hooks/use-repositories"
import type {
  IndexJob,
  IndexingMode,
  RepositoryBranch,
} from "@/features/repositories/schemas/repository.schema"
import { RepositorySearch } from "@/features/search/components/repository-search"
import { ApiError } from "@/lib/api/api-error"

interface RepositoryDetailPageProps {
  repositoryId: number
}

export function RepositoryDetailPage({
  repositoryId,
}: RepositoryDetailPageProps) {
  const authStatus = useAuthStore((state) => state.status)
  const user = useAuthStore((state) => state.user)
  const enabled = authStatus === "authenticated"
  const repository = useRepository(repositoryId, enabled)
  const branches = useRepositoryBranches(repositoryId, enabled)
  const health = useRepositoryHealth(repositoryId, enabled)
  const jobs = useIndexJobs(repositoryId, enabled)
  const canIndex =
    user?.permissions === undefined ||
    user.permissions.includes("repository.index")
  const canManageKnowledge =
    user?.permissions === undefined ||
    user.permissions.includes("knowledge.manage")
  const canSearch =
    user?.permissions === undefined || user.permissions.includes("search.use")
  const canBuildSearch =
    user?.permissions === undefined ||
    user.permissions.includes("repository.index")

  if (repository.isPending) {
    return <PageLoading />
  }

  if (repository.isError) {
    return (
      <PageError
        message={errorMessage(repository.error, "Unable to load repository.")}
        retry={() => void repository.refetch()}
      />
    )
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-7xl px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-2">
          <Link
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            href="/dashboard"
          >
            <ArrowLeft className="size-4" />
            Repositories
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {repository.data.name}
              </h1>
              <StatusPill status={repository.data.status} />
            </div>
            <p className="mt-1 break-all text-sm text-muted-foreground">
              {repository.data.remoteUrl}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user?.email}
          </span>
          <LogoutButton />
        </div>
      </header>

      <div className="space-y-6 py-8">
        <HealthSummary
          data={health.data}
          error={health.error}
          isPending={health.isPending}
        />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
          <BranchesPanel
            branches={branches.data?.branches ?? []}
            canIndex={canIndex}
            defaultBranch={branches.data?.defaultBranch ?? null}
            error={branches.error}
            isPending={branches.isPending}
            repositoryId={repositoryId}
          />
          <IndexingPanel
            branches={branches.data?.branches ?? []}
            canIndex={canIndex}
            defaultBranch={branches.data?.defaultBranch ?? null}
            repositoryId={repositoryId}
          />
        </div>
        <IndexJobHistory
          error={jobs.error}
          isPending={jobs.isPending}
          jobs={jobs.data?.data ?? []}
          retry={() => void jobs.refetch()}
        />
        <RepositorySearch
          branches={branches.data?.branches ?? []}
          canBuildSearch={canBuildSearch}
          canSearch={canSearch}
          defaultBranch={branches.data?.defaultBranch ?? null}
          repositoryId={repositoryId}
        />
        <KnowledgePanel
          canManage={canManageKnowledge}
          indexJobs={jobs.data?.data ?? []}
          repositoryId={repositoryId}
        />
      </div>
    </main>
  )
}

interface HealthSummaryProps {
  data:
    | {
        branches: { active: number; total: number }
        indexing: { lastIndexedAt: string | null }
        repositorySizeBytes: number | null
        sync: { lastSyncedAt: string | null; status: string }
      }
    | undefined
  error: Error | null
  isPending: boolean
}

function HealthSummary({ data, error, isPending }: HealthSummaryProps) {
  if (isPending) {
    return <div className="h-28 animate-pulse rounded-xl bg-muted" />
  }

  if (error || !data) {
    return (
      <FormError
        message={errorMessage(error, "Repository health is unavailable.")}
      />
    )
  }

  const items = [
    { label: "Sync status", value: titleCase(data.sync.status) },
    { label: "Last synced", value: formatDate(data.sync.lastSyncedAt) },
    {
      label: "Branches",
      value: `${data.branches.active} active / ${data.branches.total} total`,
    },
    { label: "Last indexed", value: formatDate(data.indexing.lastIndexedAt) },
    { label: "Repository size", value: formatBytes(data.repositorySizeBytes) },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} size="sm">
          <CardContent>
            <p className="text-xs font-medium text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1 font-semibold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface BranchesPanelProps {
  branches: RepositoryBranch[]
  canIndex: boolean
  defaultBranch: string | null
  error: Error | null
  isPending: boolean
  repositoryId: number
}

function BranchesPanel({
  branches,
  canIndex,
  defaultBranch,
  error,
  isPending,
  repositoryId,
}: BranchesPanelProps) {
  const synchronize = useSynchronizeBranches(repositoryId)
  const activeBranches = branches.filter((branch) => branch.status === "active")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Branches</CardTitle>
            <CardDescription>
              Synchronize Git branch names and their latest commit SHAs.
            </CardDescription>
          </div>
          {canIndex ? (
            <Button
              disabled={synchronize.isPending}
              onClick={() => synchronize.mutate()}
              type="button"
              variant="outline"
            >
              <RefreshCw
                className={synchronize.isPending ? "animate-spin" : undefined}
              />
              {synchronize.isPending ? "Syncing…" : "Sync branches"}
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <FormError
          message={
            synchronize.error
              ? errorMessage(synchronize.error, "Unable to synchronize branches.")
              : error
                ? errorMessage(error, "Unable to load branches.")
                : null
          }
        />
        {isPending ? (
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
        ) : activeBranches.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <GitBranch className="mx-auto mb-3 size-6 text-muted-foreground" />
            <p className="font-medium">No synchronized branches</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Synchronize branches before starting an index job.
            </p>
          </div>
        ) : (
          <div className="divide-y rounded-lg border">
            {activeBranches.map((branch) => (
              <div
                className="flex items-center justify-between gap-4 px-3 py-3"
                key={branch.id}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {branch.name}
                    {branch.name === defaultBranch ? (
                      <span className="ml-2 text-xs text-muted-foreground">
                        default
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                    {branch.commitSha?.slice(0, 12) ?? "No commit SHA"}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">
                  Indexed {formatDate(branch.lastIndexedAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface IndexingPanelProps {
  branches: RepositoryBranch[]
  canIndex: boolean
  defaultBranch: string | null
  repositoryId: number
}

function IndexingPanel({
  branches,
  canIndex,
  defaultBranch,
  repositoryId,
}: IndexingPanelProps) {
  const activeBranches = useMemo(
    () => branches.filter((branch) => branch.status === "active"),
    [branches],
  )
  const preferredBranch =
    activeBranches.find((branch) => branch.name === defaultBranch) ??
    activeBranches[0]
  const [branchId, setBranchId] = useState<number | null>(null)
  const [mode, setMode] = useState<IndexingMode>("incremental")
  const startIndex = useStartIndexJob(repositoryId)
  const selectedBranchId = branchId ?? preferredBranch?.id ?? null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start indexing</CardTitle>
        <CardDescription>
          Turn the selected branch into searchable code metadata.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormError
          message={
            startIndex.error
              ? errorMessage(startIndex.error, "Unable to start indexing.")
              : null
          }
        />
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="index-branch">
            Branch
          </label>
          <select
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:opacity-50"
            disabled={!canIndex || activeBranches.length === 0}
            id="index-branch"
            onChange={(event) => setBranchId(Number(event.target.value))}
            value={selectedBranchId ?? ""}
          >
            {activeBranches.length === 0 ? (
              <option value="">Synchronize branches first</option>
            ) : null}
            {activeBranches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="index-mode">
            Mode
          </label>
          <select
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:opacity-50"
            disabled={!canIndex}
            id="index-mode"
            onChange={(event) => setMode(event.target.value as IndexingMode)}
            value={mode}
          >
            <option value="incremental">Incremental — changed files only</option>
            <option value="full">Full — process every supported file</option>
          </select>
        </div>
        <Button
          className="w-full"
          disabled={!canIndex || !selectedBranchId || startIndex.isPending}
          onClick={() => {
            if (selectedBranchId) {
              startIndex.mutate({ branchId: selectedBranchId, mode })
            }
          }}
          size="lg"
          type="button"
        >
          {startIndex.isPending ? "Queueing index job…" : "Start indexing"}
        </Button>
        {!canIndex ? (
          <p className="text-xs text-muted-foreground">
            Your role does not include repository indexing permission.
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

interface IndexJobHistoryProps {
  error: Error | null
  isPending: boolean
  jobs: IndexJob[]
  retry: () => void
}

function IndexJobHistory({
  error,
  isPending,
  jobs,
  retry,
}: IndexJobHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Index history</CardTitle>
        <CardDescription>
          Active jobs refresh automatically until processing finishes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
        ) : error ? (
          <div className="space-y-3">
            <FormError
              message={errorMessage(error, "Unable to load index jobs.")}
            />
            <Button onClick={retry} type="button" variant="outline">
              Try again
            </Button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="font-medium">No index jobs yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a synchronized branch and start the first index.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <IndexJobRow job={job} key={job.id} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function IndexJobRow({ job }: { job: IndexJob }) {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium">
            Job #{job.id} · {titleCase(job.mode)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {titleCase(job.phase)} · attempt {job.attemptCount}/
            {job.maxAttempts}
          </p>
        </div>
        <StatusPill status={job.status} />
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${job.progress.percentage}%` }}
        />
      </div>
      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-4">
        <span>{job.progress.percentage}% complete</span>
        <span>{job.progress.processedFiles} files processed</span>
        <span>{job.progress.processedSymbols} symbols</span>
        <span>{job.progress.processedDependencies} dependencies</span>
      </div>
      {job.progress.currentFile ? (
        <p className="truncate font-mono text-xs text-muted-foreground">
          {job.progress.currentFile}
        </p>
      ) : null}
      {job.failure?.message ? (
        <p className="text-sm text-destructive">{job.failure.message}</p>
      ) : null}
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const success = status === "active" || status === "succeeded"
  const danger = status === "failed" || status === "cancelled"

  return (
    <span
      className={
        success
          ? "rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
          : danger
            ? "rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive"
            : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
      }
    >
      {titleCase(status)}
    </span>
  )
}

function PageLoading() {
  return (
    <main className="mx-auto min-h-svh w-full max-w-7xl space-y-6 px-6 py-8">
      <div className="h-20 animate-pulse rounded-xl bg-muted" />
      <div className="h-28 animate-pulse rounded-xl bg-muted" />
      <div className="h-80 animate-pulse rounded-xl bg-muted" />
    </main>
  )
}

function PageError({ message, retry }: { message: string; retry: () => void }) {
  return (
    <main className="mx-auto grid min-h-svh w-full max-w-xl place-items-center px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Repository unavailable</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={retry} type="button">
            Try again
          </Button>
          <Button render={<Link href="/dashboard" />} variant="outline">
            Back to repositories
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback
}

function formatDate(value: string | null): string {
  if (!value) {
    return "Never"
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function formatBytes(value: number | null): string {
  if (value === null) {
    return "Unknown"
  }

  if (value < 1_024) {
    return `${value} B`
  }

  const units = ["KB", "MB", "GB", "TB"]
  let size = value / 1_024
  let unitIndex = 0

  while (size >= 1_024 && unitIndex < units.length - 1) {
    size /= 1_024
    unitIndex += 1
  }

  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`
}

function titleCase(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

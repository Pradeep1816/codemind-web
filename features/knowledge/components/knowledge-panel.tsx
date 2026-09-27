"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FormError } from "@/features/auth"
import {
  useCurrentKnowledgeSnapshot,
  useKnowledgeBuilds,
  useKnowledgeNodes,
  useStartKnowledgeBuild,
} from "@/features/knowledge/hooks/use-knowledge"
import type { KnowledgeBuild } from "@/features/knowledge/schemas/knowledge.schema"
import type { IndexJob } from "@/features/repositories"
import { ApiError } from "@/lib/api/api-error"

interface KnowledgePanelProps {
  canManage: boolean
  indexJobs: IndexJob[]
  repositoryId: number
}

export function KnowledgePanel({
  canManage,
  indexJobs,
  repositoryId,
}: KnowledgePanelProps) {
  const builds = useKnowledgeBuilds(repositoryId, true)
  const startBuild = useStartKnowledgeBuild(repositoryId)
  const successfulJobs = useMemo(
    () => indexJobs.filter((job) => job.status === "succeeded"),
    [indexJobs],
  )
  const [sourceJobId, setSourceJobId] = useState<number | null>(null)
  const selectedJobId = sourceJobId ?? successfulJobs[0]?.id ?? null
  const selectedJob = successfulJobs.find((job) => job.id === selectedJobId)
  const existingBuild = builds.data?.data.find(
    (build) => build.sourceIndexJobId === selectedJobId,
  )
  const latestPublishedBuild = builds.data?.data.find(
    (build) => build.status === "succeeded",
  )
  const snapshotBranchId = selectedJob?.branchId ?? latestPublishedBuild?.branchId ?? null
  const snapshot = useCurrentKnowledgeSnapshot(
    repositoryId,
    snapshotBranchId,
    true,
  )
  const nodes = useKnowledgeNodes(
    repositoryId,
    snapshot.data?.id ?? null,
    snapshot.data !== null,
  )
  const buildAlreadyActiveOrPublished =
    existingBuild?.status === "queued" ||
    existingBuild?.status === "running" ||
    existingBuild?.status === "succeeded"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge</CardTitle>
        <CardDescription>
          Convert a successful code index into business rules, workflows,
          domain concepts, and architectural relationships.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="knowledge-source">
              Source index job
            </label>
            <select
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:opacity-50"
              disabled={!canManage || successfulJobs.length === 0}
              id="knowledge-source"
              onChange={(event) => setSourceJobId(Number(event.target.value))}
              value={selectedJobId ?? ""}
            >
              {successfulJobs.length === 0 ? (
                <option value="">Complete an index job first</option>
              ) : null}
              {successfulJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  Job #{job.id} · {job.mode} · {job.targetCommitSha.slice(0, 12)}
                </option>
              ))}
            </select>
          </div>
          <Button
            disabled={
              !canManage ||
              !selectedJobId ||
              buildAlreadyActiveOrPublished ||
              startBuild.isPending
            }
            onClick={() => {
              if (selectedJobId) {
                startBuild.mutate(selectedJobId)
              }
            }}
            size="lg"
            type="button"
          >
            {startBuild.isPending
              ? "Queueing knowledge build…"
              : buildAlreadyActiveOrPublished
                ? "Knowledge build exists"
                : "Build knowledge"}
          </Button>
        </div>

        <FormError
          message={
            startBuild.error
              ? errorMessage(startBuild.error, "Unable to start knowledge build.")
              : builds.error
                ? errorMessage(builds.error, "Unable to load knowledge builds.")
                : snapshot.error
                  ? errorMessage(snapshot.error, "Unable to load the knowledge snapshot.")
                  : null
          }
        />

        {!canManage ? (
          <p className="text-xs text-muted-foreground">
            Your role does not include knowledge management permission.
          </p>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-2">
          <BuildHistory
            builds={builds.data?.data ?? []}
            isPending={builds.isPending}
          />
          <SnapshotSummary
            isPending={snapshot.isPending && snapshotBranchId !== null}
            snapshot={snapshot.data}
          />
        </div>

        {snapshot.data ? (
          <KnowledgeNodePreview
            isPending={nodes.isPending}
            nodes={nodes.data?.data ?? []}
            total={nodes.data?.pagination.total ?? 0}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}

function BuildHistory({
  builds,
  isPending,
}: {
  builds: KnowledgeBuild[]
  isPending: boolean
}) {
  return (
    <section className="space-y-3">
      <h3 className="font-medium">Build history</h3>
      {isPending ? (
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      ) : builds.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">No knowledge builds yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a successful index job to generate knowledge.
          </p>
        </div>
      ) : (
        <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
          {builds.map((build) => (
            <div className="space-y-3 rounded-lg border p-4" key={build.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    Build #{build.id} · Index #{build.sourceIndexJobId}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {titleCase(build.phase)} · attempt {build.attemptCount}/
                    {build.maxAttempts}
                  </p>
                </div>
                <StatusPill status={build.status} />
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width]"
                  style={{ width: `${build.progress.percentage}%` }}
                />
              </div>
              <div className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-3">
                <span>{build.progress.processedFiles} files</span>
                <span>{build.progress.persistedNodes} nodes</span>
                <span>{build.progress.persistedEdges} edges</span>
              </div>
              {build.failure?.message ? (
                <p className="text-sm text-destructive">
                  {build.failure.message}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function SnapshotSummary({
  isPending,
  snapshot,
}: {
  isPending: boolean
  snapshot: {
    analyzerBundleVersion: string
    graph: { edges: number; nodes: number }
    id: number
    publishedAt: string
    targetCommitSha: string
  } | null | undefined
}) {
  return (
    <section className="space-y-3">
      <h3 className="font-medium">Current snapshot</h3>
      {isPending ? (
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      ) : !snapshot ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">No published snapshot</p>
          <p className="mt-1 text-sm text-muted-foreground">
            A successful knowledge build publishes the branch snapshot.
          </p>
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">Snapshot #{snapshot.id}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Published {formatDate(snapshot.publishedAt)}
              </p>
            </div>
            <StatusPill status="published" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Knowledge nodes" value={snapshot.graph.nodes} />
            <Metric label="Relationships" value={snapshot.graph.edges} />
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Commit {snapshot.targetCommitSha.slice(0, 12)}</p>
            <p>Analyzer {snapshot.analyzerBundleVersion}</p>
          </div>
        </div>
      )}
    </section>
  )
}

function KnowledgeNodePreview({
  isPending,
  nodes,
  total,
}: {
  isPending: boolean
  nodes: Array<{
    confidence: number
    id: number
    kind: string
    name: string
    summary: string | null
  }>
  total: number
}) {
  return (
    <section className="space-y-3 border-t pt-6">
      <div>
        <h3 className="font-medium">Extracted knowledge</h3>
        <p className="text-sm text-muted-foreground">
          Showing the first {Math.min(nodes.length, 20)} of {total} nodes.
        </p>
      </div>
      {isPending ? (
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      ) : nodes.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          This snapshot contains no knowledge nodes.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {nodes.map((node) => (
            <div className="rounded-lg border p-4" key={node.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{node.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {titleCase(node.kind)}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {Math.round(node.confidence * 100)}%
                </span>
              </div>
              {node.summary ? (
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                  {node.summary}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const success = status === "succeeded" || status === "published"
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

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback
}

function titleCase(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

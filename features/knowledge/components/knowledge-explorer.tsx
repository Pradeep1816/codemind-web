"use client"

import { useDeferredValue, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormError } from "@/features/auth/components/form-error"
import {
  useKnowledgeNode,
  useKnowledgeNodes,
} from "@/features/knowledge/hooks/use-knowledge"
import type {
  KnowledgeNode,
  KnowledgeNodeDetail,
  KnowledgeNodeKind,
} from "@/features/knowledge/schemas/knowledge.schema"
import { ApiError } from "@/lib/api/api-error"

interface KnowledgeExplorerProps {
  repositoryId: number
  snapshotId: number
}

const NODE_KINDS: Array<{ label: string; value: KnowledgeNodeKind | "" }> = [
  { label: "All knowledge", value: "" },
  { label: "Architectural components", value: "architectural_component" },
  { label: "Domain concepts", value: "domain_concept" },
  { label: "Business rules", value: "business_rule" },
  { label: "Workflows", value: "workflow" },
  { label: "Workflow steps", value: "workflow_step" },
  { label: "States", value: "state" },
  { label: "State transitions", value: "state_transition" },
  { label: "Domain events", value: "domain_event" },
  { label: "Event handlers", value: "event_handler" },
]

export function KnowledgeExplorer({
  repositoryId,
  snapshotId,
}: KnowledgeExplorerProps) {
  const [search, setSearch] = useState("")
  const deferredSearch = useDeferredValue(search)
  const [kind, setKind] = useState<KnowledgeNodeKind | "">("")
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null)
  const filters = { kind, search: deferredSearch }
  const nodes = useKnowledgeNodes(repositoryId, snapshotId, filters, true)
  const selectedNode = useKnowledgeNode(
    repositoryId,
    snapshotId,
    selectedNodeId,
  )

  return (
    <section className="space-y-4 border-t pt-6">
      <div>
        <h3 className="font-medium">Knowledge explorer</h3>
        <p className="text-sm text-muted-foreground">
          Search extracted knowledge and inspect the source evidence behind each
          result.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]">
        <Input
          aria-label="Search extracted knowledge"
          maxLength={200}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search rules, workflows, components…"
          type="search"
          value={search}
        />
        <select
          aria-label="Filter knowledge type"
          className="h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
          onChange={(event) =>
            setKind(event.target.value as KnowledgeNodeKind | "")
          }
          value={kind}
        >
          {NODE_KINDS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <FormError
        message={
          nodes.error
            ? errorMessage(nodes.error, "Unable to load extracted knowledge.")
            : null
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.65fr)]">
        <KnowledgeNodeGrid
          isPending={nodes.isPending}
          nodes={nodes.data?.data ?? []}
          onSelect={setSelectedNodeId}
          selectedNodeId={selectedNodeId}
          total={nodes.data?.pagination.total ?? 0}
        />
        <KnowledgeNodeDetails
          clearSelection={() => setSelectedNodeId(null)}
          error={selectedNode.error}
          isPending={selectedNode.isPending && selectedNodeId !== null}
          node={selectedNode.data}
        />
      </div>
    </section>
  )
}

interface KnowledgeNodeGridProps {
  isPending: boolean
  nodes: KnowledgeNode[]
  onSelect: (nodeId: number) => void
  selectedNodeId: number | null
  total: number
}

function KnowledgeNodeGrid({
  isPending,
  nodes,
  onSelect,
  selectedNodeId,
  total,
}: KnowledgeNodeGridProps) {
  if (isPending) {
    return <div className="h-52 animate-pulse rounded-lg bg-muted" />
  }

  if (nodes.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No knowledge nodes match these filters.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Showing {nodes.length} of {total} nodes
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {nodes.map((node) => (
          <button
            className={
              selectedNodeId === node.id
                ? "rounded-lg border border-ring bg-muted/50 p-4 text-left ring-3 ring-ring/20 transition-colors"
                : "rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
            }
            key={node.id}
            onClick={() => onSelect(node.id)}
            type="button"
          >
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
          </button>
        ))}
      </div>
    </div>
  )
}

interface KnowledgeNodeDetailsProps {
  clearSelection: () => void
  error: Error | null
  isPending: boolean
  node: KnowledgeNodeDetail | undefined
}

function KnowledgeNodeDetails({
  clearSelection,
  error,
  isPending,
  node,
}: KnowledgeNodeDetailsProps) {
  if (isPending) {
    return <div className="h-72 animate-pulse rounded-lg bg-muted" />
  }

  if (error) {
    return (
      <FormError
        message={errorMessage(error, "Unable to load knowledge details.")}
      />
    )
  }

  if (!node) {
    return (
      <div className="grid min-h-52 place-items-center rounded-lg border border-dashed p-8 text-center">
        <div>
          <p className="font-medium">Select a knowledge node</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Its properties and source evidence will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <aside className="space-y-5 rounded-lg border p-4 xl:sticky xl:top-6 xl:self-start">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {titleCase(node.kind)}
          </p>
          <h4 className="mt-1 text-lg font-semibold">{node.name}</h4>
        </div>
        <Button onClick={clearSelection} size="sm" type="button" variant="ghost">
          Close
        </Button>
      </div>

      {node.summary ? (
        <p className="text-sm text-muted-foreground">{node.summary}</p>
      ) : null}

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <DetailMetric
          label="Confidence"
          value={`${Math.round(node.confidence * 100)}%`}
        />
        <DetailMetric label="Derivation" value={titleCase(node.derivationType)} />
        <DetailMetric label="Analyzer" value={node.analyzerName} />
        <DetailMetric label="Version" value={node.analyzerVersion} />
      </dl>

      <div className="space-y-2">
        <h5 className="text-sm font-medium">Properties</h5>
        <pre className="max-h-60 overflow-auto rounded-lg bg-muted p-3 text-xs leading-5">
          {JSON.stringify(node.properties, null, 2)}
        </pre>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-medium">Source evidence</h5>
          <p className="text-xs text-muted-foreground">
            Showing {node.evidence.length} of {node.evidenceTotal} references
            {node.evidenceTruncated ? " (truncated)" : ""}.
          </p>
        </div>
        {node.evidence.length === 0 ? (
          <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            No source evidence was attached to this node.
          </p>
        ) : (
          <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {node.evidence.map((evidence) => (
              <div className="rounded-lg border p-3" key={evidence.id}>
                <div className="flex items-start justify-between gap-2">
                  <p className="break-all font-mono text-xs">
                    {evidence.file.path}
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {titleCase(evidence.role)}
                  </span>
                </div>
                {evidence.symbol ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {titleCase(evidence.symbol.kind)} ·{" "}
                    {evidence.symbol.qualifiedName}
                  </p>
                ) : null}
                {evidence.range ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Lines {evidence.range.startLine}–{evidence.range.endLine}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-medium">{value}</dd>
    </div>
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

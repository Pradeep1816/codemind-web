"use client"

import { useState } from "react"
import { Check, GitBranch, Search } from "lucide-react"
import styles from "./product-preview.module.css"

type NodeTone = "emerald" | "indigo" | "slate"

interface PreviewNode {
  className: string
  evidence: string
  id: string
  label: string
  summary: string
  tone: NodeTone
  type: string
}

const previewNodes: readonly PreviewNode[] = [
  {
    className: "left-1 top-4",
    evidence: "src/payments/payment.service.ts · class declaration",
    id: "payment-service",
    label: "PaymentService",
    summary: "Coordinates payment validation, processing, and persistence.",
    tone: "indigo",
    type: "Component",
  },
  {
    className: "left-[39%] top-[38%]",
    evidence: "src/payments/payment.service.ts · processPayment()",
    id: "process-payment",
    label: "Process payment",
    summary: "Validates the request before calculating and storing the payment.",
    tone: "slate",
    type: "Workflow",
  },
  {
    className: "bottom-3 left-2",
    evidence: "src/payments/payment.entity.ts · Payment",
    id: "payment",
    label: "Payment",
    summary: "Domain concept represented by the payment entity and workflow.",
    tone: "indigo",
    type: "Domain concept",
  },
  {
    className: "right-0 top-5",
    evidence: "src/payments/payment.service.ts · lines 48–52",
    id: "reject-inactive",
    label: "Reject inactive",
    summary: "Rejects processing when the associated account is inactive.",
    tone: "emerald",
    type: "Business rule",
  },
  {
    className: "bottom-5 right-0",
    evidence: "src/payments/payment.service.ts · lines 67–69",
    id: "round-total",
    label: "Round total",
    summary: "Rounds the calculated payment total before persistence.",
    tone: "emerald",
    type: "Business rule",
  },
] as const

export function ProductPreview() {
  const [selectedId, setSelectedId] = useState("reject-inactive")
  const selected =
    previewNodes.find((node) => node.id === selectedId) ?? previewNodes[0]

  return (
    <div className="relative z-10 mx-auto w-full max-w-2xl lg:mx-0">
      <div
        aria-hidden="true"
        className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-indigo-500/10 blur-2xl"
      />
      <div className="overflow-hidden rounded-[1.7rem] border border-slate-800 bg-slate-950 p-2 shadow-2xl shadow-slate-950/20">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            illustrative workspace
          </span>
        </div>

        <div className="grid gap-3 p-3 sm:grid-cols-[0.4fr_0.6fr]">
          <RepositoryPreview />
          <KnowledgeGraphPreview
            onSelect={setSelectedId}
            selected={selected}
            selectedId={selectedId}
          />
        </div>
      </div>
    </div>
  )
}

function RepositoryPreview() {
  const files = [
    ["src", "text-slate-300"],
    ["  payments", "text-slate-400"],
    ["    payment.service.ts", "text-indigo-300"],
    ["    payment.repository.ts", "text-slate-400"],
    ["  scheduling", "text-slate-400"],
    ["    availability.ts", "text-slate-400"],
  ] as const

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
        <GitBranch aria-hidden="true" className="size-4 text-emerald-400" />
        payment-service
      </div>
      <div className="mt-5 space-y-2 text-xs text-slate-500">
        {files.map(([label, color]) => (
          <p className={`font-mono ${color}`} key={label}>
            {label}
          </p>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-3">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
          <Check aria-hidden="true" className="size-3.5" />
          Knowledge ready
        </div>
        <p className="mt-2 text-[11px] leading-5 text-slate-500">
          Indexed snapshot · source evidence linked
        </p>
      </div>
    </div>
  )
}

function KnowledgeGraphPreview({
  onSelect,
  selected,
  selectedId,
}: {
  onSelect: (id: string) => void
  selected: PreviewNode
  selectedId: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-200">
            Extracted knowledge
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Select a node to inspect its evidence
          </p>
        </div>
        <Search aria-hidden="true" className="size-4 text-slate-500" />
      </div>

      <div className="relative mt-5 min-h-64">
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 320 256"
        >
          <path className={styles.edge} d="M70 52 C130 52 125 116 180 116" />
          <path className={styles.ruleEdge} d="M180 116 C235 116 225 58 275 58" />
          <path className={styles.ruleEdge} d="M180 116 C235 116 225 195 275 195" />
          <path className={styles.edge} d="M70 205 C125 205 125 130 180 116" />
        </svg>
        {previewNodes.map((node) => (
          <GraphNode
            isSelected={node.id === selectedId}
            key={node.id}
            node={node}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div
        aria-live="polite"
        className="min-h-28 rounded-xl border border-white/10 bg-black/20 p-3"
        id="knowledge-preview-detail"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-xs font-semibold text-slate-100">
            {selected.label}
          </p>
          <span className="shrink-0 rounded-full bg-emerald-300/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-emerald-300">
            Evidence linked
          </span>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-slate-400">
          {selected.summary}
        </p>
        <p className="mt-2 truncate font-mono text-[9px] text-indigo-300/80">
          {selected.evidence}
        </p>
      </div>
    </div>
  )
}

function GraphNode({
  isSelected,
  node,
  onSelect,
}: {
  isSelected: boolean
  node: PreviewNode
  onSelect: (id: string) => void
}) {
  const colors: Record<NodeTone, string> = {
    emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
    indigo: "border-indigo-400/30 bg-indigo-400/10 text-indigo-100",
    slate: "border-slate-500/40 bg-slate-800 text-slate-100",
  }

  return (
    <button
      aria-controls="knowledge-preview-detail"
      aria-pressed={isSelected}
      className={`absolute w-28 cursor-pointer rounded-xl border px-3 py-2 text-left shadow-xl backdrop-blur transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${colors[node.tone]} ${node.className} ${isSelected ? styles.selectedNode : ""}`}
      onClick={() => onSelect(node.id)}
      type="button"
    >
      <span className="block truncate text-[11px] font-semibold">
        {node.label}
      </span>
      <span className="mt-0.5 block truncate text-[9px] opacity-60">
        {node.type}
      </span>
    </button>
  )
}

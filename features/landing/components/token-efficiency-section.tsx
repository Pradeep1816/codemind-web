import { ArrowRight, Check } from "lucide-react"

const benefits = [
  ["Less repeated context", "Reuse indexed knowledge across repository questions."],
  ["Focused retrieval", "Select rules, symbols, and evidence related to the task."],
  ["Auditable answers", "Keep the source file and line range attached to context."],
] as const

const evaluationPlan = [
  {
    description:
      "Ask the same repository questions with the same model, instructions, and conversation limits.",
    label: "Controlled baseline",
  },
  {
    description:
      "Compare broad file context with Codexa retrieval from the same indexed commit.",
    label: "Matched retrieval",
  },
  {
    description:
      "Record input, output, and cached tokens alongside latency, grounding, and answer quality.",
    label: "Transparent reporting",
  },
] as const

export function TokenEfficiencySection() {
  return (
    <section
      className="border-b border-slate-200 bg-slate-950 text-white"
      id="token-efficiency"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Designed for focused context
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Send the model what matters—not the entire repository.
            </h2>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-slate-300 lg:justify-self-end">
            A regular code conversation can repeatedly assemble broad file
            context for every question. Codexa builds reusable structured
            knowledge first, then retrieves the most relevant rules, symbols,
            relationships, and source evidence for the task.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <RegularAiCard />
          <CodexaCard />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {benefits.map(([title, description]) => (
            <div className="flex gap-3 rounded-2xl bg-white/[0.04] p-4" key={title}>
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-300" />
              <div>
                <p className="text-sm font-medium text-slate-100">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-100">
                How token efficiency will be evaluated
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Any published comparison should isolate retrieval behavior from
                model choice and validate that lower context does not reduce
                answer quality.
              </p>
            </div>
            <span className="w-fit rounded-full bg-amber-300/10 px-3 py-1.5 font-mono text-[11px] text-amber-200 ring-1 ring-amber-300/20">
              BENCHMARK STATUS · PENDING
            </span>
          </div>

          <ol className="mt-7 grid gap-4 md:grid-cols-3">
            {evaluationPlan.map((step, index) => (
              <li className="rounded-2xl bg-black/15 p-5" key={step.label}>
                <span className="font-mono text-xs text-emerald-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-slate-100">
                  {step.label}
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-7 text-xs leading-5 text-slate-500">
          This is an architectural illustration, not a measured token or cost
          benchmark. Actual usage depends on the repository, question, model,
          retrieval configuration, and conversation history. Quantitative
          comparisons will be published after controlled evaluations.
        </p>
      </div>
    </section>
  )
}

function RegularAiCard() {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
      <ComparisonHeader
        badge="REPEATED INPUT"
        description="Broad context assembled per question"
        title="Regular AI code workflow"
      />
      <div className="mt-8 space-y-4">
        <ContextBar label="Repository files" width="w-full" />
        <ContextBar label="Dependencies and surrounding code" width="w-[82%]" />
        <ContextBar label="Conversation and instructions" width="w-[62%]" />
      </div>
      <RequestFlow middle="Collect files" tone="slate" />
      <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-6 text-slate-400">
        Similar questions may cause the model to read and interpret the same
        broad code context again.
      </p>
    </article>
  )
}

function CodexaCard() {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-indigo-400/30 bg-indigo-500/10 p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-20 size-64 rounded-full bg-indigo-500/20 blur-3xl"
      />
      <div className="relative">
        <ComparisonHeader
          badge="REUSABLE CONTEXT"
          description="Focused evidence retrieved per question"
          title="Codexa knowledge workflow"
          tone="indigo"
        />
        <div className="mt-8 space-y-4">
          <ContextBar label="Relevant knowledge nodes" tone="emerald" width="w-[46%]" />
          <ContextBar label="Connected rules and symbols" tone="indigo" width="w-[38%]" />
          <ContextBar label="Exact source evidence" tone="indigo" width="w-[28%]" />
        </div>
        <RequestFlow middle="Retrieve evidence" tone="indigo" />
        <p className="mt-6 border-t border-indigo-300/15 pt-5 text-sm leading-6 text-indigo-100/70">
          Deterministic indexing creates reusable structure before the AI
          request, helping keep model context relevant and traceable.
        </p>
      </div>
    </article>
  )
}

function ComparisonHeader({
  badge,
  description,
  title,
  tone = "slate",
}: {
  badge: string
  description: string
  title: string
  tone?: "indigo" | "slate"
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className={`mt-1 text-sm ${tone === "indigo" ? "text-indigo-200/70" : "text-slate-400"}`}>
          {description}
        </p>
      </div>
      <span
        className={
          tone === "indigo"
            ? "rounded-full bg-emerald-300/10 px-3 py-1 font-mono text-[11px] text-emerald-300 ring-1 ring-emerald-300/20"
            : "rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] text-slate-300"
        }
      >
        {badge}
      </span>
    </div>
  )
}

function RequestFlow({
  middle,
  tone,
}: {
  middle: string
  tone: "indigo" | "slate"
}) {
  const itemClass =
    tone === "indigo"
      ? "rounded-lg bg-indigo-300/10 px-2 py-3"
      : "rounded-lg bg-white/5 px-2 py-3"

  return (
    <div
      className={`mt-8 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center text-xs ${tone === "indigo" ? "text-indigo-100/70" : "text-slate-400"}`}
    >
      <span className={itemClass}>Question</span>
      <ArrowRight aria-hidden="true" className="size-3.5" />
      <span className={itemClass}>{middle}</span>
      <ArrowRight aria-hidden="true" className="size-3.5" />
      <span className={itemClass}>Model</span>
    </div>
  )
}

function ContextBar({
  label,
  tone = "slate",
  width,
}: {
  label: string
  tone?: "emerald" | "indigo" | "slate"
  width: string
}) {
  const colors = {
    emerald: "bg-emerald-300/70",
    indigo: "bg-indigo-300/60",
    slate: "bg-slate-500/55",
  } as const

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>context</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/5">
        <div className={`h-full rounded-full ${colors[tone]} ${width}`} />
      </div>
    </div>
  )
}

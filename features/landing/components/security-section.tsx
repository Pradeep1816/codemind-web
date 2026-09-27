import { Code2, FileCheck2, GitBranch, ShieldCheck } from "lucide-react"

const supportDetails = [
  {
    description: "Connect local Git repositories or GitHub repositories over HTTPS.",
    icon: GitBranch,
    title: "Repository sources",
    value: "Local Git + GitHub HTTPS",
  },
  {
    description:
      "Parse files, symbols, imports, rules, state behavior, and relationships.",
    icon: Code2,
    title: "Language coverage",
    value: "TypeScript + JavaScript",
  },
  {
    description:
      "Organization membership, repository access, roles, and permissions remain explicit.",
    icon: ShieldCheck,
    title: "Access boundary",
    value: "Organization-scoped RBAC",
  },
  {
    description:
      "Knowledge stays connected to immutable commits, files, symbols, and source ranges.",
    icon: FileCheck2,
    title: "Traceability",
    value: "Evidence-linked snapshots",
  },
] as const

export function SecuritySection() {
  return (
    <section className="border-y border-slate-800 bg-slate-950" id="security">
      <div className="mx-auto max-w-7xl px-6 py-24 text-white lg:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Supported today
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Clear capabilities. Traceable results.
            </h2>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-slate-300 lg:justify-self-end">
            Codexa keeps repository access inside the organization boundary
            and connects extracted knowledge back to the indexed source that
            produced it.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {supportDetails.map((detail) => {
            const Icon = detail.icon

            return (
              <article className="bg-slate-950 p-6 sm:p-7" key={detail.title}>
                <Icon aria-hidden="true" className="size-5 text-emerald-300" />
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {detail.title}
                </p>
                <h3 className="mt-2 font-semibold text-slate-100">
                  {detail.value}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {detail.description}
                </p>
              </article>
            )
          })}
        </div>

        <p className="mt-6 text-xs leading-5 text-slate-500">
          Additional repository providers and languages will be added through
          the same parser and integration boundaries as support expands.
        </p>
      </div>
    </section>
  )
}

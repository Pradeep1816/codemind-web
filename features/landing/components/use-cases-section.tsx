import {
  BookOpen,
  Compass,
  GitPullRequest,
  Network,
  RefreshCw,
  SearchCode,
} from "lucide-react"

const useCases = [
  {
    description:
      "Follow components, workflows, and source evidence instead of learning the system through scattered handoffs.",
    icon: Compass,
    audience: "New team members",
    title: "Navigate an unfamiliar codebase",
  },
  {
    description:
      "Find validations, permissions, state constraints, calculations, and scheduling behavior where they are implemented.",
    icon: SearchCode,
    audience: "Product engineers",
    title: "Locate business logic quickly",
  },
  {
    description:
      "Inspect service boundaries and dependency relationships before planning a refactor or reviewing a change.",
    icon: Network,
    audience: "Technical leads",
    title: "Review architecture with context",
  },
  {
    description:
      "Give engineering and product teams a shared, evidence-backed view of how the repository behaves today.",
    icon: BookOpen,
    audience: "Cross-functional teams",
    title: "Build shared system knowledge",
  },
  {
    description:
      "Trace dependencies, affected files, business rules, and workflows before modifying an existing feature.",
    icon: GitPullRequest,
    audience: "Feature teams",
    title: "Plan safer code changes",
  },
  {
    description:
      "Identify service boundaries, tightly coupled modules, and critical behavior before restructuring legacy code.",
    icon: RefreshCw,
    audience: "Platform teams",
    title: "Modernize legacy systems",
  },
] as const

export function UseCasesSection() {
  return (
    <section className="bg-[#f7f8fa]" id="use-cases">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Built for real engineering work
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Make the repository easier to understand for everyone.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600 lg:justify-self-end">
            Codexa connects technical structure to business behavior, helping
            teams answer repository questions with source evidence instead of
            institutional memory alone.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => {
            const Icon = useCase.icon

            return (
              <article
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg hover:shadow-slate-950/5 sm:p-8"
                key={useCase.title}
              >
                <div className="flex items-start gap-5">
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {useCase.audience}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight">
                      {useCase.title}
                    </h3>
                    <p className="mt-3 leading-7 text-slate-600">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

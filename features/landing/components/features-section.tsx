import { BrainCircuit, FileSearch, Network } from "lucide-react"

const capabilities = [
  {
    description:
      "Map services, repositories, modules, dependencies, and the relationships between them.",
    icon: Network,
    title: "Architecture you can navigate",
  },
  {
    description:
      "Surface validations, state constraints, workflows, and domain concepts directly from source.",
    icon: BrainCircuit,
    title: "Business logic made visible",
  },
  {
    description:
      "Find the exact file, symbol, and line range behind every result instead of guessing where logic lives.",
    icon: FileSearch,
    title: "Answers backed by evidence",
  },
] as const

export function FeaturesSection() {
  return (
    <section className="border-y border-slate-200/80 bg-white" id="features">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            From source to understanding
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            More than a code search box.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Codexa preserves how technical structure and business behavior
            connect, with evidence that takes you back to the source.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {capabilities.map((capability) => {
            const Icon = capability.icon

            return (
              <article
                className="group rounded-3xl border border-slate-200 bg-[#fafafa] p-7 transition-all hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-950/5"
                key={capability.title}
              >
                <div className="grid size-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight">
                  {capability.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {capability.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

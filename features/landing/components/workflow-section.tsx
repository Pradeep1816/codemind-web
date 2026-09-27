const workflow = [
  {
    detail: "Connect a local Git or GitHub HTTPS repository.",
    label: "Connect",
  },
  {
    detail: "Codexa indexes files, symbols, dependencies, and changes.",
    label: "Understand",
  },
  {
    detail: "Explore architecture, rules, workflows, and source evidence.",
    label: "Discover",
  },
] as const

export function WorkflowSection() {
  return (
    <section
      className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:px-8 lg:py-32"
      id="how-it-works"
    >
      <div className="lg:sticky lg:top-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
          A clear path through complex code
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Repository knowledge in three steps.
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Keep the source of truth in your code. Codexa builds a durable,
          searchable understanding on top of it.
        </p>
      </div>

      <ol className="space-y-4">
        {workflow.map((step, index) => (
          <li
            className="grid grid-cols-[auto_1fr] gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            key={step.label}
          >
            <span className="grid size-10 place-items-center rounded-full bg-slate-950 font-mono text-sm font-semibold text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-xl font-semibold tracking-tight">
                {step.label}
              </h3>
              <p className="mt-2 leading-7 text-slate-600">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

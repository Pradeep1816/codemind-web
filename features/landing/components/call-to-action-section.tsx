import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export function CallToActionSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
      <div className="relative overflow-hidden rounded-[2rem] bg-indigo-600 px-7 py-14 text-center text-white shadow-2xl shadow-indigo-950/20 sm:px-14 sm:py-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.28),transparent_38%)]"
        />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Give your team a shared understanding of the code.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-indigo-100">
            Connect a repository, build its knowledge graph, and start exploring
            the logic behind the system.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              className={buttonVariants({
                className:
                  "h-12 bg-white px-6 text-base text-indigo-700 hover:bg-indigo-50",
              })}
              href="/register"
            >
              Create your workspace
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

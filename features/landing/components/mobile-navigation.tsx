"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { CodexaLogo } from "@/components/brand/codexa-logo"
import { buttonVariants } from "@/components/ui/button"
import { landingNavigation } from "@/features/landing/constants/landing-navigation"

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <div className="lg:hidden">
      <button
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label="Open navigation"
        className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <dialog
        aria-labelledby="mobile-navigation-title"
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-slate-950/55 p-0 text-slate-950 backdrop:bg-transparent"
        id="mobile-navigation"
        onCancel={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeMenu()
          }
        }}
        onClose={() => setIsOpen(false)}
        ref={dialogRef}
      >
        <div className="ml-auto flex min-h-full w-[min(23rem,calc(100%-1.5rem))] flex-col border-l border-slate-200 bg-white px-6 pb-7 pt-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 pb-5">
            <Link
              aria-label="Codexa home"
              className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4"
              href="/"
              onClick={closeMenu}
            >
              <CodexaLogo />
            </Link>
            <button
              aria-label="Close navigation"
              autoFocus
              className="grid size-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              onClick={closeMenu}
              type="button"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="py-7">
            <p
              className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"
              id="mobile-navigation-title"
            >
              Explore Codexa
            </p>
            <ul className="mt-4 divide-y divide-slate-100">
              {landingNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    className="block py-4 text-base font-medium text-slate-700 transition hover:text-indigo-700 focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    href={item.href}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto space-y-3 border-t border-slate-200 pt-6">
            <Link
              className={buttonVariants({
                className: "h-11 w-full text-base",
              })}
              href="/register"
              onClick={closeMenu}
            >
              Create workspace
            </Link>
            <Link
              className={buttonVariants({
                className: "h-11 w-full text-base",
                variant: "outline",
              })}
              href="/login"
              onClick={closeMenu}
            >
              Sign in
            </Link>
          </div>
        </div>
      </dialog>
    </div>
  )
}

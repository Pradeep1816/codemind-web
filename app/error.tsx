"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

interface RootErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    console.error("CodeMind route failed", error)
  }, [error])

  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Something went wrong
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          We could not load this page.
        </h1>
        <p className="text-sm text-muted-foreground">
          Try the request again. If it continues to fail, check that the
          CodeMind API is available.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  )
}

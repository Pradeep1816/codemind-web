export default function RootLoading() {
  return (
    <main
      className="flex min-h-svh items-center justify-center"
      aria-label="Loading CodeMind"
      aria-live="polite"
    >
      <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      <span className="sr-only">Loading CodeMind</span>
    </main>
  )
}

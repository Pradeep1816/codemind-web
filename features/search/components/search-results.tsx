import {
  BookOpenText,
  Braces,
  FileCode2,
  GitCommitHorizontal,
  Network,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type {
  RepositorySearchResponse,
  SearchResult,
} from "@/features/search/schemas/search.schema"

interface SearchResultsProps {
  data: RepositorySearchResponse
  isFetching: boolean
  nextPage: () => void
  previousPage: () => void
  selectedResultId: number | null
  selectResult: (resultId: number) => void
}

export function SearchResults({
  data,
  isFetching,
  nextPage,
  previousPage,
  selectedResultId,
  selectResult,
}: SearchResultsProps) {
  const selectedResult =
    data.data.find((result) => result.id === selectedResultId) ?? data.data[0]

  return (
    <div className={isFetching ? "opacity-60 transition-opacity" : undefined}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span>{data.pagination.total} direct matches</span>
          <span>{data.ranking.returnedCount} ranked results</span>
          <span className="inline-flex items-center gap-1.5 font-mono">
            <GitCommitHorizontal className="size-3.5" />
            {data.searchIndex.targetCommitSha.slice(0, 12)}
          </span>
        </div>
        <span>
          Index #{data.searchIndex.id} · {formatDate(data.searchIndex.publishedAt)}
        </span>
      </div>

      {data.data.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="font-medium">No matching code or knowledge</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a symbol name, file path, business term, or fewer filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
          <div className="space-y-3">
            {data.data.map((result) => (
              <SearchResultButton
                isSelected={selectedResult?.id === result.id}
                key={result.id}
                onSelect={() => selectResult(result.id)}
                result={result}
              />
            ))}

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                disabled={data.pagination.page <= 1 || isFetching}
                onClick={previousPage}
                type="button"
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {data.pagination.page} of {Math.max(1, data.pagination.totalPages)}
              </span>
              <Button
                disabled={
                  data.pagination.page >= data.pagination.totalPages ||
                  isFetching
                }
                onClick={nextPage}
                type="button"
                variant="outline"
              >
                Next
              </Button>
            </div>
          </div>

          <SearchResultDetails result={selectedResult} />
        </div>
      )}
    </div>
  )
}

function SearchResultButton({
  isSelected,
  onSelect,
  result,
}: {
  isSelected: boolean
  onSelect: () => void
  result: SearchResult
}) {
  return (
    <button
      className={
        isSelected
          ? "w-full rounded-lg border border-ring bg-muted/50 p-4 text-left ring-3 ring-ring/20 transition-colors"
          : "w-full rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
      }
      onClick={onSelect}
      type="button"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="rounded-md bg-muted p-2 text-muted-foreground">
            <SourceTypeIcon sourceType={result.sourceType} />
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{result.title}</p>
            <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
              {result.path ?? titleCase(result.sourceType)}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary/8 px-2 py-1 text-xs font-medium">
          {formatScore(result.score)}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 whitespace-pre-wrap text-sm text-muted-foreground">
        {result.contentPreview || "No preview available."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Tag>{titleCase(result.sourceType)}</Tag>
        {result.kind ? <Tag>{titleCase(result.kind)}</Tag> : null}
        {result.language ? <Tag>{titleCase(result.language)}</Tag> : null}
        {result.ranking.graphScore > 0 ? (
          <Tag>
            <Network className="mr-1 inline size-3" />
            Related
          </Tag>
        ) : null}
      </div>
    </button>
  )
}

function SearchResultDetails({ result }: { result: SearchResult | undefined }) {
  if (!result) {
    return null
  }

  const provenance = Object.entries(result.source).filter(
    (entry): entry is [string, number] => entry[1] !== null,
  )

  return (
    <aside className="space-y-5 rounded-lg border p-4 xl:sticky xl:top-6 xl:self-start">
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{titleCase(result.sourceType)}</span>
          {result.kind ? <span>· {titleCase(result.kind)}</span> : null}
          {result.language ? <span>· {titleCase(result.language)}</span> : null}
        </div>
        <h4 className="mt-1 break-words text-lg font-semibold">{result.title}</h4>
        {result.path ? (
          <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
            {result.path}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Metric label="Total" value={formatScore(result.ranking.totalScore)} />
        <Metric
          label="Lexical"
          value={formatScore(result.ranking.lexicalScore)}
        />
        <Metric label="Graph" value={formatScore(result.ranking.graphScore)} />
      </div>

      <div className="space-y-2">
        <h5 className="text-sm font-medium">Source preview</h5>
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-3 font-mono text-xs leading-5">
          {result.contentPreview || "No preview available."}
        </pre>
      </div>

      <div className="space-y-2">
        <h5 className="text-sm font-medium">Why this result ranked</h5>
        {result.ranking.signals.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            This item was included through a related graph connection.
          </p>
        ) : (
          <div className="space-y-2">
            {result.ranking.signals.map((signal, index) => (
              <div
                className="flex items-start justify-between gap-3 rounded-lg bg-muted/60 p-3 text-xs"
                key={`${signal.name}-${signal.seedDocumentId ?? "direct"}-${index}`}
              >
                <div>
                  <p className="font-medium">{signal.description}</p>
                  <p className="mt-1 text-muted-foreground">
                    {titleCase(signal.source)} signal
                  </p>
                </div>
                <span className="font-mono">+{formatScore(signal.contribution)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h5 className="text-sm font-medium">Source provenance</h5>
        <dl className="grid grid-cols-2 gap-2 text-xs">
          {provenance.map(([key, value]) => (
            <div className="rounded-lg bg-muted/60 p-3" key={key}>
              <dt className="text-muted-foreground">{titleCase(key)}</dt>
              <dd className="mt-1 font-mono font-medium">#{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {Object.keys(result.metadata).length > 0 ? (
        <details className="text-sm">
          <summary className="cursor-pointer font-medium">Metadata</summary>
          <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-muted p-3 text-xs leading-5">
            {JSON.stringify(result.metadata, null, 2)}
          </pre>
        </details>
      ) : null}
    </aside>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-3 text-center">
      <p className="font-mono text-sm font-semibold">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
      {children}
    </span>
  )
}

function SourceTypeIcon({
  sourceType,
}: {
  sourceType: SearchResult["sourceType"]
}) {
  if (sourceType === "file") {
    return <FileCode2 className="size-4" />
  }

  if (sourceType === "knowledge_node") {
    return <BookOpenText className="size-4" />
  }

  return <Braces className="size-4" />
}

function formatScore(value: number): string {
  return value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function titleCase(value: string): string {
  return value
    .replace(/Id$/, " ID")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

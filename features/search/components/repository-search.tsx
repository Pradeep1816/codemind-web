"use client"

import { useMemo, useState, type FormEvent } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FormError } from "@/features/auth/components/form-error"
import type { RepositoryBranch } from "@/features/repositories/schemas/repository.schema"
import { SearchResults } from "@/features/search/components/search-results"
import {
  useBuildRepositorySearchIndex,
  useRepositorySearch,
} from "@/features/search/hooks/use-search"
import type {
  RepositorySearchInput,
  SearchDocumentKind,
  SearchLanguage,
  SearchSourceType,
} from "@/features/search/schemas/search.schema"
import { ApiError } from "@/lib/api/api-error"

interface RepositorySearchProps {
  branches: RepositoryBranch[]
  canBuildSearch: boolean
  canSearch: boolean
  defaultBranch: string | null
  repositoryId: number
}

const SOURCE_TYPES: Array<{ label: string; value: SearchSourceType | "" }> = [
  { label: "All sources", value: "" },
  { label: "Files", value: "file" },
  { label: "Symbols", value: "symbol" },
  { label: "Knowledge", value: "knowledge_node" },
]

const LANGUAGES: Array<{ label: string; value: SearchLanguage | "" }> = [
  { label: "All languages", value: "" },
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "JSON", value: "json" },
  { label: "Markdown", value: "markdown" },
  { label: "YAML", value: "yaml" },
]

const KINDS: Array<{ label: string; value: SearchDocumentKind | "" }> = [
  { label: "All kinds", value: "" },
  { label: "File", value: "file" },
  { label: "Class", value: "class" },
  { label: "Interface", value: "interface" },
  { label: "Function", value: "function" },
  { label: "Method", value: "method" },
  { label: "Enum", value: "enum" },
  { label: "Type alias", value: "type_alias" },
  { label: "Architectural component", value: "architectural_component" },
  { label: "Domain concept", value: "domain_concept" },
  { label: "Business rule", value: "business_rule" },
  { label: "Workflow", value: "workflow" },
  { label: "Workflow step", value: "workflow_step" },
  { label: "State", value: "state" },
  { label: "State transition", value: "state_transition" },
  { label: "Domain event", value: "domain_event" },
  { label: "Event handler", value: "event_handler" },
]

export function RepositorySearch({
  branches,
  canBuildSearch,
  canSearch,
  defaultBranch,
  repositoryId,
}: RepositorySearchProps) {
  const activeBranches = useMemo(
    () => branches.filter((branch) => branch.status === "active"),
    [branches],
  )
  const preferredBranch =
    activeBranches.find((branch) => branch.name === defaultBranch) ??
    activeBranches[0]
  const [branchId, setBranchId] = useState<number | null>(null)
  const [query, setQuery] = useState("")
  const [sourceType, setSourceType] = useState<SearchSourceType | "">("")
  const [language, setLanguage] = useState<SearchLanguage | "">("")
  const [kind, setKind] = useState<SearchDocumentKind | "">("")
  const [submittedSearch, setSubmittedSearch] =
    useState<RepositorySearchInput | null>(null)
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null)
  const selectedBranchId = branchId ?? preferredBranch?.id ?? null
  const search = useRepositorySearch(
    repositoryId,
    submittedSearch,
    canSearch,
  )
  const buildSearchIndex = useBuildRepositorySearchIndex(repositoryId)
  const searchIndexMissing =
    search.error instanceof ApiError && search.error.status === 404

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedQuery = query.trim()

    if (!selectedBranchId || normalizedQuery.length === 0) {
      return
    }

    setSelectedResultId(null)
    setSubmittedSearch({
      branchId: selectedBranchId,
      query: normalizedQuery,
      page: 1,
      limit: 20,
      sourceType,
      language,
      kind,
    })
  }

  function changePage(page: number) {
    setSelectedResultId(null)
    setSubmittedSearch((current) =>
      current ? { ...current, page: Math.max(1, page) } : current,
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search repository intelligence</CardTitle>
        <CardDescription>
          Find source files, symbols, business rules, and related knowledge from
          the current published index.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form className="space-y-3" onSubmit={submit}>
          <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)_auto]">
            <select
              aria-label="Search branch"
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:opacity-50"
              disabled={!canSearch || activeBranches.length === 0}
              onChange={(event) => {
                setBranchId(Number(event.target.value))
                setSubmittedSearch(null)
                setSelectedResultId(null)
              }}
              value={selectedBranchId ?? ""}
            >
              {activeBranches.length === 0 ? (
                <option value="">Synchronize branches first</option>
              ) : null}
              {activeBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                  {branch.name === defaultBranch ? " · default" : ""}
                </option>
              ))}
            </select>
            <Input
              aria-label="Search repository intelligence"
              disabled={!canSearch}
              maxLength={200}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a symbol, path, workflow, or business rule…"
              type="search"
              value={query}
            />
            <Button
              disabled={
                !canSearch ||
                !selectedBranchId ||
                query.trim().length === 0 ||
                search.isFetching
              }
              size="lg"
              type="submit"
            >
              <Search />
              {search.isFetching ? "Searching…" : "Search"}
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <FilterSelect
              label="Source type"
              onChange={(value) => setSourceType(value as SearchSourceType | "")}
              options={SOURCE_TYPES}
              value={sourceType}
            />
            <FilterSelect
              label="Language"
              onChange={(value) => setLanguage(value as SearchLanguage | "")}
              options={LANGUAGES}
              value={language}
            />
            <FilterSelect
              label="Result kind"
              onChange={(value) => setKind(value as SearchDocumentKind | "")}
              options={KINDS}
              value={kind}
            />
          </div>
        </form>

        {!canSearch ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Your role does not include repository search permission.
          </p>
        ) : activeBranches.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Synchronize a branch before searching this repository.
          </p>
        ) : null}

        <FormError
          message={
            search.error ? searchErrorMessage(search.error) : null
          }
        />

        {buildSearchIndex.error ? (
          <FormError
            message={
              buildSearchIndex.error instanceof ApiError
                ? buildSearchIndex.error.message
                : "Unable to build the search index."
            }
          />
        ) : null}

        {searchIndexMissing && submittedSearch ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-dashed p-5">
            <div>
              <p className="font-medium">Build this branch&apos;s search index</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Codexa will create searchable documents from the current code
                index and published knowledge snapshot.
              </p>
            </div>
            <Button
              disabled={!canBuildSearch || buildSearchIndex.isPending}
              onClick={() => buildSearchIndex.mutate(submittedSearch.branchId)}
              type="button"
            >
              {buildSearchIndex.isPending
                ? "Building search index…"
                : "Build search index"}
            </Button>
            {!canBuildSearch ? (
              <p className="w-full text-xs text-muted-foreground">
                Repository indexing permission is required to build it.
              </p>
            ) : null}
          </div>
        ) : null}

        {search.isPending && submittedSearch ? (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
            <div className="h-72 animate-pulse rounded-lg bg-muted" />
            <div className="h-72 animate-pulse rounded-lg bg-muted" />
          </div>
        ) : search.data ? (
          <SearchResults
            data={search.data}
            isFetching={search.isFetching}
            nextPage={() => changePage(search.data.pagination.page + 1)}
            previousPage={() => changePage(search.data.pagination.page - 1)}
            selectedResultId={selectedResultId}
            selectResult={setSelectedResultId}
          />
        ) : submittedSearch === null && canSearch ? (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <Search className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 font-medium">Search indexed repository knowledge</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a class name, method, file path, workflow, or domain term.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
  value: string
}) {
  return (
    <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
      <span>{label}</span>
      <select
        className="h-8 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function searchErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 404) {
    return "No published search index exists for this branch yet."
  }

  return error instanceof ApiError
    ? error.message
    : "Unable to search this repository."
}

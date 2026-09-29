import { z } from "zod"

export const searchSourceTypeSchema = z.enum([
  "file",
  "symbol",
  "knowledge_node",
])

export const searchLanguageSchema = z.enum([
  "typescript",
  "javascript",
  "json",
  "markdown",
  "yaml",
])

export const searchDocumentKindSchema = z.enum([
  "file",
  "class",
  "interface",
  "function",
  "method",
  "enum",
  "type_alias",
  "architectural_component",
  "domain_concept",
  "business_rule",
  "workflow",
  "workflow_step",
  "state",
  "state_transition",
  "domain_event",
  "event_handler",
])

const searchDocumentSchema = z.object({
  id: z.number().int().positive(),
  sourceType: searchSourceTypeSchema,
  title: z.string(),
  contentPreview: z.string(),
  path: z.string().nullable(),
  language: z.string().nullable(),
  kind: z.string().nullable(),
  source: z.object({
    indexedFileId: z.number().int().positive().nullable(),
    fileHashId: z.number().int().positive().nullable(),
    codeSymbolId: z.number().int().positive().nullable(),
    knowledgeNodeId: z.number().int().positive().nullable(),
  }),
  metadata: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
  ),
})

export const searchResultSchema = searchDocumentSchema.extend({
  score: z.number(),
  match: z.object({
    exactIdentifier: z.boolean(),
    exactTitle: z.boolean(),
    exactPath: z.boolean(),
    titlePrefix: z.boolean(),
    identifierPrefix: z.boolean(),
    pathContains: z.boolean(),
    lexical: z.boolean(),
  }),
  ranking: z.object({
    lexicalScore: z.number(),
    graphScore: z.number(),
    totalScore: z.number(),
    signals: z.array(
      z.object({
        source: z.enum(["exact", "lexical", "graph"]),
        name: z.string(),
        contribution: z.number(),
        description: z.string(),
        seedDocumentId: z.number().int().positive().optional(),
      }),
    ),
  }),
})

export const repositorySearchResponseSchema = z.object({
  searchIndex: z.object({
    id: z.number().int().positive(),
    repositoryId: z.number().int().positive(),
    branchId: z.number().int().positive(),
    knowledgeSnapshotId: z.number().int().positive(),
    sourceIndexJobId: z.number().int().positive(),
    targetCommitSha: z.string(),
    indexerVersion: z.string(),
    publishedAt: z.string().datetime({ offset: true }),
  }),
  query: z.object({
    original: z.string(),
    normalized: z.string(),
  }),
  filters: z.object({
    sourceType: searchSourceTypeSchema.nullable(),
    language: searchLanguageSchema.nullable(),
    kind: searchDocumentKindSchema.nullable(),
  }),
  data: z.array(searchResultSchema),
  ranking: z.object({
    candidateCount: z.number().int().nonnegative(),
    deduplicatedCount: z.number().int().nonnegative(),
    returnedCount: z.number().int().nonnegative(),
    truncated: z.boolean(),
  }),
  graphExpansion: z.object({
    depth: z.literal(1),
    seedsConsidered: z.number().int().nonnegative(),
    maxSeeds: z.number().int().nonnegative(),
    maxNeighborsPerSeed: z.number().int().nonnegative(),
    maxTotalCandidates: z.number().int().nonnegative(),
    truncated: z.boolean(),
    data: z.array(
      z.object({
        seedDocumentId: z.number().int().positive(),
        document: searchDocumentSchema,
        relationship: z.object({
          source: z.enum(["code_dependency", "knowledge_edge"]),
          kind: z.string(),
          direction: z.enum(["incoming", "outgoing"]),
          depth: z.literal(1),
        }),
      }),
    ),
  }),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
})

export const searchProjectionResponseSchema = z.object({
  searchIndexId: z.number().int().positive(),
  repositoryId: z.number().int().positive(),
  branchId: z.number().int().positive(),
  knowledgeSnapshotId: z.number().int().positive(),
  sourceIndexJobId: z.number().int().positive(),
  targetCommitSha: z.string(),
  indexerVersion: z.string(),
  isCurrent: z.boolean(),
  reused: z.boolean(),
  documentCount: z.number().int().nonnegative(),
  publishedAt: z.string().datetime({ offset: true }),
  documents: z.object({
    files: z.number().int().nonnegative(),
    symbols: z.number().int().nonnegative(),
    knowledgeNodes: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
  }),
})

export interface RepositorySearchInput {
  branchId: number
  query: string
  page: number
  limit: number
  sourceType: SearchSourceType | ""
  language: SearchLanguage | ""
  kind: SearchDocumentKind | ""
}

export type SearchSourceType = z.infer<typeof searchSourceTypeSchema>
export type SearchLanguage = z.infer<typeof searchLanguageSchema>
export type SearchDocumentKind = z.infer<typeof searchDocumentKindSchema>
export type SearchResult = z.infer<typeof searchResultSchema>
export type RepositorySearchResponse = z.infer<
  typeof repositorySearchResponseSchema
>
export type SearchProjectionResponse = z.infer<
  typeof searchProjectionResponseSchema
>

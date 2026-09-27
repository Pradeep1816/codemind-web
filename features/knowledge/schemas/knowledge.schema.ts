import { z } from "zod"

const nullableDateTimeSchema = z.string().datetime({ offset: true }).nullable()

export const knowledgeBuildSchema = z.object({
  id: z.number().int().positive(),
  repositoryId: z.number().int().positive(),
  branchId: z.number().int().positive(),
  sourceIndexJobId: z.number().int().positive(),
  requestedByUserId: z.string().uuid().nullable(),
  trigger: z.enum(["manual", "indexing_completed"]),
  status: z.enum(["queued", "running", "succeeded", "failed", "cancelled"]),
  phase: z.enum([
    "queued",
    "preparing",
    "analyzing",
    "validating",
    "publishing",
    "finished",
  ]),
  targetCommitSha: z.string(),
  analyzerBundleVersion: z.string(),
  configurationDigest: z.string(),
  progress: z.object({
    percentage: z.number().min(0).max(100),
    totalFiles: z.number().int().nonnegative(),
    processedFiles: z.number().int().nonnegative(),
    failedFiles: z.number().int().nonnegative(),
    emittedFacts: z.number().int().nonnegative(),
    persistedNodes: z.number().int().nonnegative(),
    persistedEdges: z.number().int().nonnegative(),
    currentFile: z.string().nullable(),
  }),
  attemptCount: z.number().int().nonnegative(),
  maxAttempts: z.number().int().positive(),
  failure: z
    .object({ code: z.string().nullable(), message: z.string().nullable() })
    .nullable(),
  startedAt: nullableDateTimeSchema,
  completedAt: nullableDateTimeSchema,
  lastHeartbeatAt: nullableDateTimeSchema,
  nextAttemptAt: nullableDateTimeSchema,
  cancellationRequestedAt: nullableDateTimeSchema,
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

const paginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
})

export const knowledgeBuildListSchema = z.object({
  data: z.array(knowledgeBuildSchema),
  pagination: paginationSchema,
})

export const knowledgeSnapshotSchema = z.object({
  id: z.number().int().positive(),
  repositoryId: z.number().int().positive(),
  branchId: z.number().int().positive(),
  knowledgeBuildId: z.number().int().positive(),
  sourceIndexJobId: z.number().int().positive(),
  targetCommitSha: z.string(),
  analyzerBundleVersion: z.string(),
  configurationDigest: z.string(),
  status: z.enum(["draft", "published"]),
  isCurrent: z.boolean(),
  publishedAt: z.string().datetime({ offset: true }),
  supersededAt: nullableDateTimeSchema,
  createdAt: z.string().datetime({ offset: true }),
  graph: z.object({
    nodes: z.number().int().nonnegative(),
    edges: z.number().int().nonnegative(),
  }),
})

export const knowledgeNodeSchema = z.object({
  id: z.number().int().positive(),
  identityKey: z.string(),
  kind: z.enum([
    "architectural_component",
    "domain_concept",
    "business_rule",
    "workflow",
    "workflow_step",
    "state",
    "state_transition",
    "domain_event",
    "event_handler",
  ]),
  name: z.string(),
  summary: z.string().nullable(),
  derivationType: z.enum([
    "deterministic",
    "heuristic",
    "ai_assisted",
    "human_confirmed",
  ]),
  confidence: z.number().min(0).max(1),
  analyzerName: z.string(),
  analyzerVersion: z.string(),
  contentFingerprint: z.string(),
  propertySchemaVersion: z.number().int().positive(),
  properties: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime({ offset: true }),
})

const knowledgeEvidenceSchema = z.object({
  id: z.number().int().positive(),
  role: z.enum([
    "declaration",
    "call_site",
    "decorator",
    "injection",
    "condition",
    "assignment",
    "configuration",
    "import",
    "export",
    "inheritance",
    "event_publication",
    "event_handler",
  ]),
  file: z.object({
    id: z.number().int().positive(),
    path: z.string(),
    hash: z.object({
      id: z.number().int().positive(),
      algorithm: z.literal("sha256"),
      value: z.string(),
    }),
  }),
  symbol: z
    .object({
      id: z.number().int().positive(),
      name: z.string(),
      qualifiedName: z.string(),
      kind: z.enum([
        "class",
        "interface",
        "function",
        "method",
        "enum",
        "type_alias",
      ]),
    })
    .nullable(),
  range: z
    .object({
      startLine: z.number().int().nonnegative(),
      startColumn: z.number().int().nonnegative(),
      startOffset: z.number().int().nonnegative(),
      endLine: z.number().int().nonnegative(),
      endColumn: z.number().int().nonnegative(),
      endOffset: z.number().int().nonnegative(),
    })
    .nullable(),
})

export const knowledgeNodeDetailSchema = knowledgeNodeSchema.extend({
  evidence: z.array(knowledgeEvidenceSchema),
  evidenceTotal: z.number().int().nonnegative(),
  evidenceTruncated: z.boolean(),
})

export const knowledgeNodeListSchema = z.object({
  data: z.array(knowledgeNodeSchema),
  pagination: paginationSchema,
})

export type KnowledgeBuild = z.infer<typeof knowledgeBuildSchema>
export type KnowledgeBuildList = z.infer<typeof knowledgeBuildListSchema>
export type KnowledgeSnapshot = z.infer<typeof knowledgeSnapshotSchema>
export type KnowledgeNode = z.infer<typeof knowledgeNodeSchema>
export type KnowledgeNodeDetail = z.infer<typeof knowledgeNodeDetailSchema>
export type KnowledgeNodeList = z.infer<typeof knowledgeNodeListSchema>
export type KnowledgeNodeKind = KnowledgeNode["kind"]

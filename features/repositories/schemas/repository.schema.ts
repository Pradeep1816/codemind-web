import { z } from "zod"

export const repositoryProviderSchema = z.enum([
  "github",
  "gitlab",
  "bitbucket",
  "generic",
])

export const repositoryStatusSchema = z.enum(["active", "disabled"])

export const repositorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  provider: repositoryProviderSchema,
  remoteUrl: z.string().url(),
  defaultBranch: z.string().nullable(),
  status: repositoryStatusSchema,
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const repositoryListSchema = z.object({
  data: z.array(repositorySchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
})

export const repositoryBranchSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  commitSha: z.string().nullable(),
  status: z.enum(["active", "deleted"]),
  lastIndexedAt: z.string().datetime({ offset: true }).nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const repositoryBranchesSchema = z.object({
  repositoryId: z.number().int().positive(),
  defaultBranch: z.string().nullable(),
  branches: z.array(repositoryBranchSchema),
})

export const repositoryHealthSchema = z.object({
  repositoryId: z.number().int().positive(),
  status: repositoryStatusSchema,
  sync: z.object({
    status: z.enum(["never", "succeeded", "failed"]),
    lastAttemptedAt: z.string().datetime({ offset: true }).nullable(),
    lastSyncedAt: z.string().datetime({ offset: true }).nullable(),
  }),
  indexing: z.object({
    lastIndexedAt: z.string().datetime({ offset: true }).nullable(),
  }),
  branches: z.object({
    total: z.number().int().nonnegative(),
    active: z.number().int().nonnegative(),
    deleted: z.number().int().nonnegative(),
  }),
  repositorySizeBytes: z.number().int().nonnegative().nullable(),
})

export const indexJobStatusSchema = z.enum([
  "queued",
  "running",
  "succeeded",
  "failed",
  "cancelled",
])

export const indexJobSchema = z.object({
  id: z.number().int().positive(),
  repositoryId: z.number().int().positive(),
  branchId: z.number().int().positive(),
  requestedByUserId: z.string().uuid().nullable(),
  trigger: z.enum(["manual", "repository_sync"]),
  mode: z.enum(["incremental", "full"]),
  status: indexJobStatusSchema,
  phase: z.enum([
    "queued",
    "preparing",
    "discovering",
    "hashing",
    "analyzing",
    "extracting_symbols",
    "building_graph",
    "finalizing",
    "finished",
  ]),
  targetCommitSha: z.string(),
  retryOfJobId: z.number().int().positive().nullable(),
  progress: z.object({
    percentage: z.number().min(0).max(100),
    totalFiles: z.number().int().nonnegative(),
    processedFiles: z.number().int().nonnegative(),
    skippedFiles: z.number().int().nonnegative(),
    failedFiles: z.number().int().nonnegative(),
    processedSymbols: z.number().int().nonnegative(),
    processedDependencies: z.number().int().nonnegative(),
    currentFile: z.string().nullable(),
  }),
  attemptCount: z.number().int().nonnegative(),
  maxAttempts: z.number().int().positive(),
  failure: z
    .object({ code: z.string().nullable(), message: z.string().nullable() })
    .nullable(),
  startedAt: z.string().datetime({ offset: true }).nullable(),
  completedAt: z.string().datetime({ offset: true }).nullable(),
  lastHeartbeatAt: z.string().datetime({ offset: true }).nullable(),
  nextAttemptAt: z.string().datetime({ offset: true }).nullable(),
  cancellationRequestedAt: z.string().datetime({ offset: true }).nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const indexJobListSchema = z.object({
  data: z.array(indexJobSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
})

export const createRepositorySchema = z.object({
  name: z.string().trim().min(2, "Name must have at least 2 characters").max(160),
  remoteUrl: z
    .string()
    .trim()
    .url("Enter a valid repository URL")
    .refine(isSafeRepositoryUrl, {
      message:
        "Use an HTTPS repository URL without credentials, query parameters, or fragments",
    }),
  defaultBranch: z
    .string()
    .trim()
    .max(255)
    .refine((value) => value === "" || /^[A-Za-z0-9._/-]+$/.test(value), {
      message: "Branch contains unsupported characters",
    }),
})

export type Repository = z.infer<typeof repositorySchema>
export type RepositoryList = z.infer<typeof repositoryListSchema>
export type CreateRepositoryInput = z.infer<typeof createRepositorySchema>
export type RepositoryBranch = z.infer<typeof repositoryBranchSchema>
export type RepositoryBranches = z.infer<typeof repositoryBranchesSchema>
export type RepositoryHealth = z.infer<typeof repositoryHealthSchema>
export type IndexJob = z.infer<typeof indexJobSchema>
export type IndexJobList = z.infer<typeof indexJobListSchema>
export type IndexingMode = IndexJob["mode"]

function isSafeRepositoryUrl(value: string): boolean {
  try {
    const url = new URL(value)

    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.pathname !== "/"
    )
  } catch {
    return false
  }
}

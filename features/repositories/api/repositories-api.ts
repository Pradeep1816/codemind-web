import type { ZodType } from "zod"
import { authenticatedApiRequest } from "@/features/auth/api/authenticated-request"
import {
  type CreateRepositoryInput,
  type IndexJob,
  type IndexJobList,
  type IndexingMode,
  type Repository,
  type RepositoryBranches,
  type RepositoryHealth,
  type RepositoryList,
  indexJobListSchema,
  indexJobSchema,
  repositoryBranchesSchema,
  repositoryHealthSchema,
  repositoryListSchema,
  repositorySchema,
} from "@/features/repositories/schemas/repository.schema"
import { ApiError } from "@/lib/api/api-error"

export async function listRepositories(): Promise<RepositoryList> {
  const payload = await authenticatedApiRequest<unknown>(
    "/repositories?page=1&limit=100",
  )

  return parseResponse(repositoryListSchema, payload)
}

export async function createRepository(
  input: CreateRepositoryInput,
): Promise<Repository> {
  const payload = await authenticatedApiRequest<unknown>("/repositories", {
    json: {
      name: input.name,
      remoteUrl: input.remoteUrl,
      ...(input.defaultBranch
        ? { defaultBranch: input.defaultBranch }
        : {}),
    },
    method: "POST",
  })

  return parseResponse(repositorySchema, payload)
}

export async function getRepository(repositoryId: number): Promise<Repository> {
  const payload = await authenticatedApiRequest<unknown>(
    `/repositories/${repositoryId}`,
  )

  return parseResponse(repositorySchema, payload)
}

export async function getRepositoryBranches(
  repositoryId: number,
): Promise<RepositoryBranches> {
  const payload = await authenticatedApiRequest<unknown>(
    `/repositories/${repositoryId}/branches`,
  )

  return parseResponse(repositoryBranchesSchema, payload)
}

export async function synchronizeRepositoryBranches(
  repositoryId: number,
): Promise<RepositoryBranches> {
  const payload = await authenticatedApiRequest<unknown>(
    `/repositories/${repositoryId}/branches/sync`,
    { method: "POST" },
  )

  return parseResponse(repositoryBranchesSchema, payload)
}

export async function getRepositoryHealth(
  repositoryId: number,
): Promise<RepositoryHealth> {
  const payload = await authenticatedApiRequest<unknown>(
    `/repositories/${repositoryId}/status`,
  )

  return parseResponse(repositoryHealthSchema, payload)
}

export async function listIndexJobs(
  repositoryId: number,
): Promise<IndexJobList> {
  const payload = await authenticatedApiRequest<unknown>(
    `/repositories/${repositoryId}/index-jobs?page=1&limit=20`,
  )

  return parseResponse(indexJobListSchema, payload)
}

export async function startIndexJob(
  repositoryId: number,
  input: { branchId: number; mode: IndexingMode },
): Promise<IndexJob> {
  const payload = await authenticatedApiRequest<unknown>(
    `/repositories/${repositoryId}/index-jobs`,
    { json: input, method: "POST" },
  )

  return parseResponse(indexJobSchema, payload)
}

function parseResponse<T>(schema: ZodType<T>, payload: unknown): T {
  const result = schema.safeParse(payload)

  if (!result.success) {
    throw new ApiError(
      "Codexa returned an unexpected repository response.",
      502,
      "INVALID_RESPONSE",
      null,
    )
  }

  return result.data
}

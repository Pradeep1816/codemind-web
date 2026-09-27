import type { ZodType } from "zod"
import { authenticatedApiRequest } from "@/features/auth"
import {
  type CreateRepositoryInput,
  type Repository,
  type RepositoryList,
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

function parseResponse<T>(schema: ZodType<T>, payload: unknown): T {
  const result = schema.safeParse(payload)

  if (!result.success) {
    throw new ApiError(
      "CodeMind returned an unexpected repository response.",
      502,
      "INVALID_RESPONSE",
      null,
    )
  }

  return result.data
}

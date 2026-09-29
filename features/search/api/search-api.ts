import { authenticatedApiRequest } from "@/features/auth/api/authenticated-request"
import {
  type RepositorySearchInput,
  type RepositorySearchResponse,
  repositorySearchResponseSchema,
  type SearchProjectionResponse,
  searchProjectionResponseSchema,
} from "@/features/search/schemas/search.schema"
import { ApiError } from "@/lib/api/api-error"

export async function searchRepository(
  repositoryId: number,
  input: RepositorySearchInput,
): Promise<RepositorySearchResponse> {
  const query = new URLSearchParams({
    branchId: String(input.branchId),
    query: input.query.trim(),
    page: String(input.page),
    limit: String(input.limit),
  })

  if (input.sourceType) {
    query.set("sourceType", input.sourceType)
  }

  if (input.language) {
    query.set("language", input.language)
  }

  if (input.kind) {
    query.set("kind", input.kind)
  }

  const payload = await authenticatedApiRequest<unknown>(
    `/repositories/${repositoryId}/search?${query.toString()}`,
  )
  const parsed = repositorySearchResponseSchema.safeParse(payload)

  if (!parsed.success) {
    throw new ApiError(
      "Codexa returned an unexpected search response.",
      502,
      "INVALID_RESPONSE",
      null,
    )
  }

  return parsed.data
}

export async function buildRepositorySearchIndex(
  repositoryId: number,
  branchId: number,
): Promise<SearchProjectionResponse> {
  const payload = await authenticatedApiRequest<unknown>(
    `/repositories/${repositoryId}/search/indexes`,
    { json: { branchId }, method: "POST" },
  )
  const parsed = searchProjectionResponseSchema.safeParse(payload)

  if (!parsed.success) {
    throw new ApiError(
      "Codexa returned an unexpected search-index response.",
      502,
      "INVALID_RESPONSE",
      null,
    )
  }

  return parsed.data
}

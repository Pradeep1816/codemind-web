import type { ZodType } from "zod"
import { authenticatedApiRequest } from "@/features/auth"
import {
  type KnowledgeBuild,
  type KnowledgeBuildList,
  type KnowledgeNodeList,
  type KnowledgeSnapshot,
  knowledgeBuildListSchema,
  knowledgeBuildSchema,
  knowledgeNodeListSchema,
  knowledgeSnapshotSchema,
} from "@/features/knowledge/schemas/knowledge.schema"
import { ApiError } from "@/lib/api/api-error"

export async function listKnowledgeBuilds(
  repositoryId: number,
): Promise<KnowledgeBuildList> {
  const payload = await authenticatedApiRequest<unknown>(
    `/repositories/${repositoryId}/knowledge/builds?page=1&limit=20`,
  )

  return parseResponse(knowledgeBuildListSchema, payload)
}

export async function startKnowledgeBuild(
  repositoryId: number,
  sourceIndexJobId: number,
): Promise<KnowledgeBuild> {
  const payload = await authenticatedApiRequest<unknown>(
    `/repositories/${repositoryId}/knowledge/builds`,
    { json: { sourceIndexJobId }, method: "POST" },
  )

  return parseResponse(knowledgeBuildSchema, payload)
}

export async function getCurrentKnowledgeSnapshot(
  repositoryId: number,
  branchId: number,
): Promise<KnowledgeSnapshot | null> {
  try {
    const payload = await authenticatedApiRequest<unknown>(
      `/repositories/${repositoryId}/knowledge/snapshots/current?branchId=${branchId}`,
    )

    return parseResponse(knowledgeSnapshotSchema, payload)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }

    throw error
  }
}

export async function listKnowledgeNodes(
  repositoryId: number,
  snapshotId: number,
): Promise<KnowledgeNodeList> {
  const payload = await authenticatedApiRequest<unknown>(
    `/repositories/${repositoryId}/knowledge/snapshots/${snapshotId}/nodes?page=1&limit=20`,
  )

  return parseResponse(knowledgeNodeListSchema, payload)
}

function parseResponse<T>(schema: ZodType<T>, payload: unknown): T {
  const result = schema.safeParse(payload)

  if (!result.success) {
    throw new ApiError(
      "CodeMind returned an unexpected knowledge response.",
      502,
      "INVALID_RESPONSE",
      null,
    )
  }

  return result.data
}

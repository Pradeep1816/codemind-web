"use client"

import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getCurrentKnowledgeSnapshot,
  getKnowledgeNode,
  listKnowledgeBuilds,
  listKnowledgeNodes,
  retryKnowledgeBuild,
  startKnowledgeBuild,
} from "@/features/knowledge/api/knowledge-api"
import type { KnowledgeNodeKind } from "@/features/knowledge/schemas/knowledge.schema"

export const knowledgeKeys = {
  all: (repositoryId: number) => ["knowledge", repositoryId] as const,
  builds: (repositoryId: number) =>
    [...knowledgeKeys.all(repositoryId), "builds"] as const,
  currentSnapshot: (repositoryId: number, branchId: number) =>
    [...knowledgeKeys.all(repositoryId), "current-snapshot", branchId] as const,
  nodes: (
    repositoryId: number,
    snapshotId: number,
    filters: { kind: KnowledgeNodeKind | ""; search: string },
  ) =>
    [
      ...knowledgeKeys.all(repositoryId),
      "snapshot",
      snapshotId,
      "nodes",
      filters,
    ] as const,
  node: (repositoryId: number, snapshotId: number, nodeId: number) =>
    [
      ...knowledgeKeys.all(repositoryId),
      "snapshot",
      snapshotId,
      "node",
      nodeId,
    ] as const,
}

export function useKnowledgeBuilds(repositoryId: number, enabled: boolean) {
  const queryClient = useQueryClient()
  const query = useQuery({
    enabled,
    queryFn: () => listKnowledgeBuilds(repositoryId),
    queryKey: knowledgeKeys.builds(repositoryId),
    refetchInterval: (currentQuery) =>
      currentQuery.state.data?.data.some(
        (build) => build.status === "queued" || build.status === "running",
      )
        ? 2_000
        : false,
  })
  const latestBuild = query.data?.data[0]

  useEffect(() => {
    if (!latestBuild || latestBuild.status !== "succeeded") {
      return
    }

    void queryClient.invalidateQueries({
      queryKey: knowledgeKeys.currentSnapshot(
        repositoryId,
        latestBuild.branchId,
      ),
    })
  }, [latestBuild, queryClient, repositoryId])

  return query
}

export function useStartKnowledgeBuild(repositoryId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sourceIndexJobId: number) =>
      startKnowledgeBuild(repositoryId, sourceIndexJobId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: knowledgeKeys.builds(repositoryId),
      })
    },
  })
}

export function useRetryKnowledgeBuild(repositoryId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (buildId: number) => retryKnowledgeBuild(repositoryId, buildId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: knowledgeKeys.builds(repositoryId),
      })
    },
  })
}

export function useCurrentKnowledgeSnapshot(
  repositoryId: number,
  branchId: number | null,
  enabled: boolean,
) {
  return useQuery({
    enabled: enabled && branchId !== null,
    queryFn: () => getCurrentKnowledgeSnapshot(repositoryId, branchId!),
    queryKey: knowledgeKeys.currentSnapshot(repositoryId, branchId ?? 0),
  })
}

export function useKnowledgeNodes(
  repositoryId: number,
  snapshotId: number | null,
  filters: { kind: KnowledgeNodeKind | ""; search: string },
  enabled: boolean,
) {
  return useQuery({
    enabled: enabled && snapshotId !== null,
    queryFn: () => listKnowledgeNodes(repositoryId, snapshotId!, filters),
    queryKey: knowledgeKeys.nodes(repositoryId, snapshotId ?? 0, filters),
  })
}

export function useKnowledgeNode(
  repositoryId: number,
  snapshotId: number,
  nodeId: number | null,
) {
  return useQuery({
    enabled: nodeId !== null,
    queryFn: () => getKnowledgeNode(repositoryId, snapshotId, nodeId!),
    queryKey: knowledgeKeys.node(repositoryId, snapshotId, nodeId ?? 0),
  })
}

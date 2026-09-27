"use client"

import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createRepository,
  getRepository,
  getRepositoryBranches,
  getRepositoryHealth,
  listRepositories,
  listIndexJobs,
  startIndexJob,
  synchronizeRepositoryBranches,
} from "@/features/repositories/api/repositories-api"
import type { IndexingMode } from "@/features/repositories/schemas/repository.schema"

export const repositoryKeys = {
  all: ["repositories"] as const,
  list: () => [...repositoryKeys.all, "list"] as const,
  detail: (repositoryId: number) =>
    [...repositoryKeys.all, "detail", repositoryId] as const,
  branches: (repositoryId: number) =>
    [...repositoryKeys.detail(repositoryId), "branches"] as const,
  health: (repositoryId: number) =>
    [...repositoryKeys.detail(repositoryId), "health"] as const,
  indexJobs: (repositoryId: number) =>
    [...repositoryKeys.detail(repositoryId), "index-jobs"] as const,
}

export function useRepository(repositoryId: number, enabled: boolean) {
  return useQuery({
    enabled,
    queryFn: () => getRepository(repositoryId),
    queryKey: repositoryKeys.detail(repositoryId),
  })
}

export function useRepositoryBranches(repositoryId: number, enabled: boolean) {
  return useQuery({
    enabled,
    queryFn: () => getRepositoryBranches(repositoryId),
    queryKey: repositoryKeys.branches(repositoryId),
  })
}

export function useRepositoryHealth(repositoryId: number, enabled: boolean) {
  return useQuery({
    enabled,
    queryFn: () => getRepositoryHealth(repositoryId),
    queryKey: repositoryKeys.health(repositoryId),
  })
}

export function useIndexJobs(repositoryId: number, enabled: boolean) {
  const queryClient = useQueryClient()
  const query = useQuery({
    enabled,
    queryFn: () => listIndexJobs(repositoryId),
    queryKey: repositoryKeys.indexJobs(repositoryId),
    refetchInterval: (query) =>
      query.state.data?.data.some(
        (job) => job.status === "queued" || job.status === "running",
      )
        ? 2_000
        : false,
  })
  const latestJob = query.data?.data[0]

  useEffect(() => {
    if (
      !latestJob ||
      latestJob.status === "queued" ||
      latestJob.status === "running"
    ) {
      return
    }

    void Promise.all([
      queryClient.invalidateQueries({
        queryKey: repositoryKeys.branches(repositoryId),
      }),
      queryClient.invalidateQueries({
        queryKey: repositoryKeys.health(repositoryId),
      }),
    ])
  }, [latestJob, queryClient, repositoryId])

  return query
}

export function useRepositories(enabled: boolean) {
  return useQuery({
    enabled,
    queryFn: listRepositories,
    queryKey: repositoryKeys.list(),
  })
}

export function useCreateRepository() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRepository,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: repositoryKeys.all })
    },
  })
}

export function useSynchronizeBranches(repositoryId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => synchronizeRepositoryBranches(repositoryId),
    onSuccess: async (branches) => {
      queryClient.setQueryData(repositoryKeys.branches(repositoryId), branches)
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: repositoryKeys.detail(repositoryId),
        }),
        queryClient.invalidateQueries({ queryKey: repositoryKeys.list() }),
      ])
    },
  })
}

export function useStartIndexJob(repositoryId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { branchId: number; mode: IndexingMode }) =>
      startIndexJob(repositoryId, input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: repositoryKeys.indexJobs(repositoryId),
        }),
        queryClient.invalidateQueries({
          queryKey: repositoryKeys.health(repositoryId),
        }),
      ])
    },
  })
}

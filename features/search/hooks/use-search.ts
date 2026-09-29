"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  buildRepositorySearchIndex,
  searchRepository,
} from "@/features/search/api/search-api"
import type { RepositorySearchInput } from "@/features/search/schemas/search.schema"

export const searchKeys = {
  all: (repositoryId: number) => ["search", repositoryId] as const,
  query: (repositoryId: number, input: RepositorySearchInput | null) =>
    [...searchKeys.all(repositoryId), input] as const,
}

export function useRepositorySearch(
  repositoryId: number,
  input: RepositorySearchInput | null,
  enabled: boolean,
) {
  return useQuery({
    enabled: enabled && input !== null,
    queryFn: () => searchRepository(repositoryId, input!),
    queryKey: searchKeys.query(repositoryId, input),
  })
}

export function useBuildRepositorySearchIndex(repositoryId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (branchId: number) =>
      buildRepositorySearchIndex(repositoryId, branchId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: searchKeys.all(repositoryId),
      })
    },
  })
}

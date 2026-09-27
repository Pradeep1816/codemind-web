"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createRepository,
  listRepositories,
} from "@/features/repositories/api/repositories-api"

export const repositoryKeys = {
  all: ["repositories"] as const,
  list: () => [...repositoryKeys.all, "list"] as const,
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

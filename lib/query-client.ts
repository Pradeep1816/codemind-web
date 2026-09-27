import { QueryClient } from "@tanstack/react-query"
import { ApiError } from "@/lib/api/api-error"

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: shouldRetryRequest,
        staleTime: 30 * 1000,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

function shouldRetryRequest(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status < 500) {
    return false
  }

  return failureCount < 2
}

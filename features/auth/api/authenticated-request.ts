import { apiRequest, type ApiRequestOptions } from "@/lib/api/client"
import { ApiError } from "@/lib/api/api-error"
import { refreshSession } from "@/features/auth/api/auth-client"
import type { AuthSession } from "@/features/auth/schemas/auth.schema"
import { useAuthStore } from "@/features/auth/stores/auth.store"

let refreshPromise: Promise<AuthSession> | null = null

export async function authenticatedApiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const accessToken = useAuthStore.getState().accessToken

  if (!accessToken) {
    throw new ApiError(
      "An authenticated session is required.",
      401,
      "UNAUTHENTICATED",
      null,
    )
  }

  try {
    return await apiRequest<TResponse>(path, { ...options, accessToken })
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error
    }
  }

  const session = await refreshAccessToken()

  try {
    return await apiRequest<TResponse>(path, {
      ...options,
      accessToken: session.accessToken,
    })
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      useAuthStore.getState().clearSession()
    }

    throw error
  }
}

async function refreshAccessToken(): Promise<AuthSession> {
  if (!refreshPromise) {
    refreshPromise = refreshSession()
      .then((session) => {
        useAuthStore.getState().setSession(session)
        return session
      })
      .catch((error: unknown) => {
        useAuthStore.getState().clearSession()
        throw error
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

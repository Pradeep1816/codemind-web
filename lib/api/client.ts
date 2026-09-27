import { publicEnv } from "@/lib/env"
import { ApiError } from "./api-error"

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  accessToken?: string
  json?: unknown
}

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { accessToken, headers: initialHeaders, json, ...requestInit } = options
  const headers = new Headers(initialHeaders)

  headers.set("Accept", "application/json")

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`)
  }

  if (json !== undefined) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(createApiUrl(path), {
    ...requestInit,
    body: json === undefined ? undefined : JSON.stringify(json),
    cache: requestInit.cache ?? "no-store",
    headers,
  })

  if (response.status === 204) {
    return undefined as TResponse
  }

  const payload = await parseResponse(response)

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload)
  }

  return payload as TResponse
}

function createApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${publicEnv.NEXT_PUBLIC_API_BASE_URL}${normalizedPath}`
}

async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

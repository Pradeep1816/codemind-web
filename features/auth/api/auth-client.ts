import { z } from "zod"
import { ApiError } from "@/lib/api/api-error"
import {
  type AuthSession,
  type LoginInput,
  type RegisterInput,
  type RegisterResponse,
  registerResponseSchema,
  sessionResponseSchema,
} from "@/features/auth/schemas/auth.schema"

export async function login(input: LoginInput): Promise<AuthSession> {
  return requestJson("/api/auth/login", sessionResponseSchema, {
    body: JSON.stringify(input),
    method: "POST",
  })
}

export async function register(
  input: RegisterInput,
): Promise<RegisterResponse> {
  return requestJson("/api/auth/register", registerResponseSchema, {
    body: JSON.stringify(input),
    method: "POST",
  })
}

export async function refreshSession(): Promise<AuthSession> {
  return requestJson("/api/auth/refresh", sessionResponseSchema, {
    method: "POST",
  })
}

export async function logout(accessToken: string): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    body: JSON.stringify({ accessToken }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, await readPayload(response))
  }
}

async function requestJson<T>(
  url: string,
  schema: z.ZodType<T>,
  init: RequestInit,
): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    })
  } catch {
    throw new ApiError(
      "Unable to reach CodeMind. Check your connection and try again.",
      0,
      null,
      null,
    )
  }

  const payload = await readPayload(response)

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload)
  }

  const result = schema.safeParse(payload)

  if (!result.success) {
    throw new ApiError(
      "CodeMind returned an unexpected response.",
      response.status,
      "INVALID_RESPONSE",
      null,
    )
  }

  return result.data
}

async function readPayload(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown
  } catch {
    return null
  }
}

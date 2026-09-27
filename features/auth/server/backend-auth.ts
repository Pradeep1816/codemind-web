import "server-only"

import { publicEnv } from "@/lib/env"

interface BackendAuthResult {
  ok: boolean
  status: number
  payload: unknown
}

interface BackendAuthOptions {
  accessToken?: string
  body?: unknown
  method: "GET" | "POST"
}

export async function requestBackendAuth(
  request: Request,
  path: string,
  options: BackendAuthOptions,
): Promise<BackendAuthResult> {
  const headers = new Headers({ Accept: "application/json" })
  const userAgent = request.headers.get("user-agent")

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json")
  }

  if (options.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`)
  }

  if (userAgent) {
    headers.set("User-Agent", userAgent)
  }

  try {
    const response = await fetch(
      `${publicEnv.NEXT_PUBLIC_API_BASE_URL}/${path.replace(/^\/+/, "")}`,
      {
        body:
          options.body === undefined ? undefined : JSON.stringify(options.body),
        cache: "no-store",
        headers,
        method: options.method,
      },
    )

    return {
      ok: response.ok,
      status: response.status,
      payload: await readPayload(response),
    }
  } catch {
    return {
      ok: false,
      status: 503,
      payload: {
        error: "Service Unavailable",
        message: "The authentication service is temporarily unavailable",
        statusCode: 503,
      },
    }
  }
}

export function backendFailureResponse(result: BackendAuthResult): Response {
  const payload = readErrorPayload(result.payload)

  return Response.json(
    {
      error: payload?.error ?? "Authentication request failed",
      message:
        payload?.message ??
        "The authentication service could not complete the request",
      statusCode: result.status,
    },
    { status: result.status },
  )
}

function readErrorPayload(payload: unknown): {
  error?: string
  message?: string | string[]
} | null {
  if (typeof payload !== "object" || payload === null) {
    return null
  }

  const { error, message } = payload as Record<string, unknown>

  return {
    error: typeof error === "string" ? error : undefined,
    message:
      typeof message === "string" ||
      (Array.isArray(message) &&
        message.every((item) => typeof item === "string"))
        ? message
        : undefined,
  }
}

async function readPayload(response: Response): Promise<unknown> {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return null
  }
}

export interface ApiErrorPayload {
  message?: string | string[]
  error?: string
  statusCode?: number
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string | null,
    readonly payload: unknown,
  ) {
    super(message)
    this.name = ApiError.name
  }

  static fromResponse(status: number, payload: unknown): ApiError {
    const body = isApiErrorPayload(payload) ? payload : null
    const message = normalizeMessage(body?.message) ?? "The request failed"

    return new ApiError(message, status, body?.error ?? null, payload)
  }
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return typeof value === "object" && value !== null
}

function normalizeMessage(message: string | string[] | undefined) {
  if (Array.isArray(message)) {
    return message.join(". ")
  }

  return message?.trim() || null
}

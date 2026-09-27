import { logoutRequestSchema } from "@/features/auth/schemas/auth.schema"
import {
  backendFailureResponse,
  requestBackendAuth,
} from "@/features/auth/server/backend-auth"
import { clearRefreshToken } from "@/features/auth/server/refresh-cookie"

export async function POST(request: Request) {
  const input = logoutRequestSchema.safeParse(await readJson(request))

  if (!input.success) {
    return Response.json(
      { error: "Bad Request", message: "Invalid logout request", statusCode: 400 },
      { status: 400 },
    )
  }

  const result = await requestBackendAuth(request, "auth/logout", {
    accessToken: input.data.accessToken,
    method: "POST",
  })

  await clearRefreshToken()

  if (!result.ok && result.status !== 401) {
    return backendFailureResponse(result)
  }

  return new Response(null, { status: 204 })
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return (await request.json()) as unknown
  } catch {
    return null
  }
}

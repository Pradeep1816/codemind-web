import {
  loginResponseSchema,
  loginSchema,
} from "@/features/auth/schemas/auth.schema"
import {
  backendFailureResponse,
  requestBackendAuth,
} from "@/features/auth/server/backend-auth"
import { writeRefreshToken } from "@/features/auth/server/refresh-cookie"

export async function POST(request: Request) {
  const input = loginSchema.safeParse(await readJson(request))

  if (!input.success) {
    return Response.json(
      { error: "Bad Request", message: "Invalid login details", statusCode: 400 },
      { status: 400 },
    )
  }

  const result = await requestBackendAuth(request, "auth/login", {
    body: input.data,
    method: "POST",
  })

  if (!result.ok) {
    return backendFailureResponse(result)
  }

  const login = loginResponseSchema.safeParse(result.payload)

  if (!login.success) {
    return Response.json(
      {
        error: "Bad Gateway",
        message: "The authentication service returned an invalid response",
        statusCode: 502,
      },
      { status: 502 },
    )
  }

  await writeRefreshToken(
    login.data.refreshToken,
    login.data.refreshExpiresIn,
  )

  return Response.json({
    accessToken: login.data.accessToken,
    expiresIn: login.data.expiresIn,
    tokenType: login.data.tokenType,
    user: login.data.user,
  })
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return (await request.json()) as unknown
  } catch {
    return null
  }
}

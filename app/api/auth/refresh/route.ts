import {
  authenticatedUserSchema,
  sessionResponseSchema,
  tokenPairSchema,
} from "@/features/auth/schemas/auth.schema"
import {
  backendFailureResponse,
  requestBackendAuth,
} from "@/features/auth/server/backend-auth"
import {
  clearRefreshToken,
  readRefreshToken,
  writeRefreshToken,
} from "@/features/auth/server/refresh-cookie"

export async function POST(request: Request) {
  const refreshToken = await readRefreshToken()

  if (!refreshToken) {
    return unauthorizedResponse()
  }

  const refreshResult = await requestBackendAuth(request, "auth/refresh", {
    body: { refreshToken },
    method: "POST",
  })

  if (!refreshResult.ok) {
    if (refreshResult.status === 401) {
      await clearRefreshToken()
    }

    return backendFailureResponse(refreshResult)
  }

  const tokenPair = tokenPairSchema.safeParse(refreshResult.payload)

  if (!tokenPair.success) {
    await clearRefreshToken()
    return invalidBackendResponse()
  }

  await writeRefreshToken(
    tokenPair.data.refreshToken,
    tokenPair.data.refreshExpiresIn,
  )

  const identityResult = await requestBackendAuth(request, "auth/me", {
    accessToken: tokenPair.data.accessToken,
    method: "GET",
  })

  if (!identityResult.ok) {
    return backendFailureResponse(identityResult)
  }

  const user = authenticatedUserSchema.safeParse(identityResult.payload)

  if (!user.success) {
    return invalidBackendResponse()
  }

  const session = sessionResponseSchema.parse({
    accessToken: tokenPair.data.accessToken,
    expiresIn: tokenPair.data.expiresIn,
    tokenType: tokenPair.data.tokenType,
    user: user.data,
  })

  return Response.json(session)
}

function unauthorizedResponse(): Response {
  return Response.json(
    {
      error: "Unauthorized",
      message: "An authenticated session is required",
      statusCode: 401,
    },
    { status: 401 },
  )
}

function invalidBackendResponse(): Response {
  return Response.json(
    {
      error: "Bad Gateway",
      message: "The authentication service returned an invalid response",
      statusCode: 502,
    },
    { status: 502 },
  )
}

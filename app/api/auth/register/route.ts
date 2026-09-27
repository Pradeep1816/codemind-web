import {
  registerResponseSchema,
  registerSchema,
} from "@/features/auth/schemas/auth.schema"
import {
  backendFailureResponse,
  requestBackendAuth,
} from "@/features/auth/server/backend-auth"

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await readJson(request))

  if (!parsed.success) {
    return Response.json(
      {
        error: "Bad Request",
        message: "Invalid registration details",
        statusCode: 400,
      },
      { status: 400 },
    )
  }

  const result = await requestBackendAuth(request, "auth/register", {
    body: {
      email: parsed.data.email,
      name: parsed.data.name,
      organizationName: parsed.data.organizationName,
      organizationSlug: parsed.data.organizationSlug,
      password: parsed.data.password,
    },
    method: "POST",
  })

  if (!result.ok) {
    return backendFailureResponse(result)
  }

  const registration = registerResponseSchema.safeParse(result.payload)

  if (!registration.success) {
    return Response.json(
      {
        error: "Bad Gateway",
        message: "The registration service returned an invalid response",
        statusCode: 502,
      },
      { status: 502 },
    )
  }

  return Response.json(registration.data, { status: 201 })
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return (await request.json()) as unknown
  } catch {
    return null
  }
}

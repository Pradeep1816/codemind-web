import { z } from "zod"

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url()
    .transform((value) => value.replace(/\/+$/, "")),
})

const result = publicEnvironmentSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3000/api/v1",
})

if (!result.success) {
  const fields = result.error.issues
    .map((issue) => issue.path.join("."))
    .filter(Boolean)
    .join(", ")

  throw new Error(`Invalid public environment configuration: ${fields}`)
}

export const publicEnv = result.data

import { z } from "zod"

export const repositoryProviderSchema = z.enum([
  "github",
  "gitlab",
  "bitbucket",
  "generic",
])

export const repositoryStatusSchema = z.enum(["active", "disabled"])

export const repositorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  provider: repositoryProviderSchema,
  remoteUrl: z.string().url(),
  defaultBranch: z.string().nullable(),
  status: repositoryStatusSchema,
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const repositoryListSchema = z.object({
  data: z.array(repositorySchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
})

export const createRepositorySchema = z.object({
  name: z.string().trim().min(2, "Name must have at least 2 characters").max(160),
  remoteUrl: z
    .string()
    .trim()
    .url("Enter a valid repository URL")
    .refine(isSafeRepositoryUrl, {
      message:
        "Use an HTTPS repository URL without credentials, query parameters, or fragments",
    }),
  defaultBranch: z
    .string()
    .trim()
    .max(255)
    .refine((value) => value === "" || /^[A-Za-z0-9._/-]+$/.test(value), {
      message: "Branch contains unsupported characters",
    }),
})

export type Repository = z.infer<typeof repositorySchema>
export type RepositoryList = z.infer<typeof repositoryListSchema>
export type CreateRepositoryInput = z.infer<typeof createRepositorySchema>

function isSafeRepositoryUrl(value: string): boolean {
  try {
    const url = new URL(value)

    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.pathname !== "/"
    )
  } catch {
    return false
  }
}

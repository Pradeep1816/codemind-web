import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  password: z.string().min(1, "Password is required").max(128),
})

export const registerSchema = z
  .object({
    organizationName: z.string().trim().min(2).max(160),
    organizationSlug: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers, and single hyphens",
      ),
    name: z.string().trim().min(2).max(150),
    email: z.string().trim().toLowerCase().email().max(320),
    password: z.string().min(12).max(128),
    confirmPassword: z.string(),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const authenticatedUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  organization: z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
  }),
  roles: z.array(z.string()),
  permissions: z.array(z.string()).optional(),
})

export const tokenPairSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(32),
  tokenType: z.literal("Bearer"),
  expiresIn: z.string(),
  refreshExpiresIn: z.string(),
})

export const loginResponseSchema = tokenPairSchema.extend({
  user: authenticatedUserSchema,
})

export const sessionResponseSchema = tokenPairSchema
  .omit({ refreshToken: true, refreshExpiresIn: true })
  .extend({ user: authenticatedUserSchema })

export const registerResponseSchema = z.object({
  organization: z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
  }),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    status: z.string(),
    role: z.string(),
  }),
})

export const logoutRequestSchema = z.object({
  accessToken: z.string().min(1),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterFormInput = z.infer<typeof registerSchema>
export type RegisterInput = Omit<RegisterFormInput, "confirmPassword">
export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>
export type TokenPair = z.infer<typeof tokenPairSchema>
export type AuthSession = z.infer<typeof sessionResponseSchema>
export type RegisterResponse = z.infer<typeof registerResponseSchema>

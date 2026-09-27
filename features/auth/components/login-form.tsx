"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/features/auth/api/auth-client"
import { FormError } from "@/features/auth/components/form-error"
import {
  type LoginInput,
  loginSchema,
} from "@/features/auth/schemas/auth.schema"
import { useAuthStore } from "@/features/auth/stores/auth.store"
import { ApiError } from "@/lib/api/api-error"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [requestError, setRequestError] = useState<string | null>(null)
  const authStatus = useAuthStore((state) => state.status)
  const setSession = useAuthStore((state) => state.setSession)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = handleSubmit(async (input) => {
    setRequestError(null)

    try {
      const session = await login(input)
      setSession(session)
      router.replace("/dashboard")
    } catch (error) {
      setRequestError(
        error instanceof ApiError
          ? error.message
          : "Unable to sign in. Please try again.",
      )
    }
  })

  const registered = searchParams.get("registered") === "1"

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign in to Codexa</CardTitle>
        <CardDescription>
          Continue to your organization&apos;s repository intelligence workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" id="login-form" onSubmit={onSubmit}>
          {registered ? (
            <p
              className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400"
              role="status"
            >
              Organization created. Sign in with your owner account.
            </p>
          ) : null}
          <FormError message={requestError} />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              id="email"
              placeholder="you@company.com"
              type="email"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              aria-invalid={Boolean(errors.password)}
              autoComplete="current-password"
              id="password"
              type="password"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            ) : null}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button
          className="w-full"
          disabled={isSubmitting || authStatus === "loading"}
          form="login-form"
          size="lg"
          type="submit"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-sm text-muted-foreground">
          New to Codexa?{" "}
          <Link
            className="font-medium text-foreground hover:underline"
            href="/register"
          >
            Create an organization
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

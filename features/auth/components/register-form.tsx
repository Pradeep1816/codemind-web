"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { register as registerAccount } from "@/features/auth/api/auth-client"
import { FormError } from "@/features/auth/components/form-error"
import {
  type RegisterFormInput,
  registerSchema,
} from "@/features/auth/schemas/auth.schema"
import { ApiError } from "@/lib/api/api-error"

export function RegisterForm() {
  const router = useRouter()
  const [requestError, setRequestError] = useState<string | null>(null)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      confirmPassword: "",
      email: "",
      name: "",
      organizationName: "",
      organizationSlug: "",
      password: "",
    },
  })

  const onSubmit = handleSubmit(async (formInput) => {
    setRequestError(null)
    const input = {
      email: formInput.email,
      name: formInput.name,
      organizationName: formInput.organizationName,
      organizationSlug: formInput.organizationSlug,
      password: formInput.password,
    }

    try {
      await registerAccount(input)
      router.replace("/login?registered=1")
    } catch (error) {
      setRequestError(
        error instanceof ApiError
          ? error.message
          : "Unable to create the organization. Please try again.",
      )
    }
  })

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Create your CodeMind workspace</CardTitle>
        <CardDescription>
          Register an organization and its first owner account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" id="register-form" onSubmit={onSubmit}>
          <FormError message={requestError} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              error={errors.organizationName?.message}
              id="organizationName"
              label="Organization name"
            >
              <Input
                aria-invalid={Boolean(errors.organizationName)}
                autoComplete="organization"
                id="organizationName"
                placeholder="Acme Engineering"
                {...register("organizationName")}
              />
            </Field>
            <Field
              error={errors.organizationSlug?.message}
              id="organizationSlug"
              label="Organization slug"
            >
              <Input
                aria-invalid={Boolean(errors.organizationSlug)}
                autoCapitalize="none"
                id="organizationSlug"
                placeholder="acme-engineering"
                {...register("organizationSlug")}
              />
            </Field>
          </div>
          <Field error={errors.name?.message} id="name" label="Your name">
            <Input
              aria-invalid={Boolean(errors.name)}
              autoComplete="name"
              id="name"
              placeholder="Ada Lovelace"
              {...register("name")}
            />
          </Field>
          <Field error={errors.email?.message} id="email" label="Email">
            <Input
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              id="email"
              placeholder="you@company.com"
              type="email"
              {...register("email")}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              error={errors.password?.message}
              id="password"
              label="Password"
            >
              <Input
                aria-invalid={Boolean(errors.password)}
                autoComplete="new-password"
                id="password"
                type="password"
                {...register("password")}
              />
            </Field>
            <Field
              error={errors.confirmPassword?.message}
              id="confirmPassword"
              label="Confirm password"
            >
              <Input
                aria-invalid={Boolean(errors.confirmPassword)}
                autoComplete="new-password"
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
            </Field>
          </div>
          <p className="text-xs text-muted-foreground">
            Use at least 12 characters for your password.
          </p>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button
          className="w-full"
          disabled={isSubmitting}
          form="register-form"
          size="lg"
          type="submit"
        >
          {isSubmitting ? "Creating workspace…" : "Create workspace"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            className="font-medium text-foreground hover:underline"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

interface FieldProps {
  children: ReactNode
  error?: string
  id: string
  label: string
}

function Field({ children, error, id, label }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

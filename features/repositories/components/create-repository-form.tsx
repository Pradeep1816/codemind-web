"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormError } from "@/features/auth"
import { useCreateRepository } from "@/features/repositories/hooks/use-repositories"
import {
  type CreateRepositoryInput,
  createRepositorySchema,
} from "@/features/repositories/schemas/repository.schema"
import { ApiError } from "@/lib/api/api-error"

interface CreateRepositoryFormProps {
  canCreate: boolean
}

export function CreateRepositoryForm({
  canCreate,
}: CreateRepositoryFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const createRepository = useCreateRepository()
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CreateRepositoryInput>({
    defaultValues: { defaultBranch: "", name: "", remoteUrl: "" },
    resolver: zodResolver(createRepositorySchema),
  })

  if (!canCreate) {
    return null
  }

  const onSubmit = handleSubmit(async (input) => {
    try {
      await createRepository.mutateAsync(input)
      reset()
      setIsOpen(false)
    } catch {
      // The mutation exposes a safe error below and keeps the form values.
    }
  })

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} size="lg" type="button">
        Add repository
      </Button>
    )
  }

  const requestError = createRepository.error
  const errorMessage =
    requestError instanceof ApiError
      ? requestError.message
      : requestError
        ? "Unable to add the repository. Please try again."
        : null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add repository</CardTitle>
        <CardDescription>
          Register an HTTPS Git URL. Credentials must not be included in the
          URL.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <FormError message={errorMessage} />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="repository-name">Name</Label>
              <Input
                aria-invalid={Boolean(errors.name)}
                id="repository-name"
                placeholder="Payments API"
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-branch">Default branch</Label>
              <Input
                aria-invalid={Boolean(errors.defaultBranch)}
                id="default-branch"
                placeholder="main (optional)"
                {...register("defaultBranch")}
              />
              {errors.defaultBranch ? (
                <p className="text-xs text-destructive">
                  {errors.defaultBranch.message}
                </p>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="remote-url">Repository URL</Label>
            <Input
              aria-invalid={Boolean(errors.remoteUrl)}
              autoCapitalize="none"
              autoComplete="url"
              id="remote-url"
              placeholder="https://github.com/organization/repository.git"
              type="url"
              {...register("remoteUrl")}
            />
            {errors.remoteUrl ? (
              <p className="text-xs text-destructive">
                {errors.remoteUrl.message}
              </p>
            ) : null}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              disabled={createRepository.isPending}
              onClick={() => {
                createRepository.reset()
                setIsOpen(false)
              }}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={createRepository.isPending} type="submit">
              {createRepository.isPending ? "Adding…" : "Add repository"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

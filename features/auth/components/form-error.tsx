interface FormErrorProps {
  message: string | null
}

export function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null
  }

  return (
    <p
      className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
      role="alert"
    >
      {message}
    </p>
  )
}

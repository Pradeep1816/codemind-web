import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

const sizes = {
  lg: {
    mark: "size-11 rounded-[0.9rem]",
    symbol: "size-8",
    wordmark: "text-xl",
  },
  md: {
    mark: "size-9 rounded-xl",
    symbol: "size-6",
    wordmark: "text-lg",
  },
  sm: {
    mark: "size-7 rounded-lg",
    symbol: "size-5",
    wordmark: "text-base",
  },
} as const

interface CodexaLogoProps
  extends Omit<ComponentProps<"span">, "children"> {
  showWordmark?: boolean
  size?: keyof typeof sizes
  tone?: "default" | "inverse" | "muted"
}

const wordmarkTones = {
  default: "text-slate-950",
  inverse: "text-white",
  muted: "text-slate-700",
} as const

const accentTones = {
  default: "text-indigo-600",
  inverse: "text-emerald-300",
  muted: "text-indigo-600",
} as const

export function CodexaLogo({
  className,
  showWordmark = true,
  size = "md",
  tone = "default",
  ...props
}: CodexaLogoProps) {
  const styles = sizes[size]

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2.5 font-semibold tracking-[-0.025em]",
        wordmarkTones[tone],
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid shrink-0 place-items-center bg-[linear-gradient(145deg,#020617_0%,#312e81_58%,#4f46e5_100%)] shadow-sm shadow-indigo-950/20",
          styles.mark,
        )}
      >
        <svg
          className={styles.symbol}
          fill="none"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 8.25 5.75 16l4.75 7.75M21.5 8.25 26.25 16l-4.75 7.75"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.25"
          />
          <path
            d="m14.1 11.65 4.85 4.25-4.85 4.45"
            stroke="#6ee7b7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.65"
          />
          <circle cx="14.1" cy="11.65" fill="white" r="1.45" />
          <circle cx="18.95" cy="15.9" fill="#6ee7b7" r="1.6" />
          <circle cx="14.1" cy="20.35" fill="white" r="1.45" />
        </svg>
      </span>

      {showWordmark ? (
        <span className={cn("leading-none", styles.wordmark)}>
          Code<span className={accentTones[tone]}>xa</span>
        </span>
      ) : (
        <span className="sr-only">Codexa</span>
      )}
    </span>
  )
}

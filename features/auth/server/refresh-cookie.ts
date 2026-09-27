import "server-only"

import { cookies } from "next/headers"

const DEVELOPMENT_COOKIE_NAME = "codemind_refresh"
const PRODUCTION_COOKIE_NAME = "__Host-codemind_refresh"

function cookieName(): string {
  return process.env.NODE_ENV === "production"
    ? PRODUCTION_COOKIE_NAME
    : DEVELOPMENT_COOKIE_NAME
}

export async function readRefreshToken(): Promise<string | null> {
  return (await cookies()).get(cookieName())?.value ?? null
}

export async function writeRefreshToken(
  token: string,
  expiresIn: string,
): Promise<void> {
  const cookieStore = await cookies()
  const maxAge = parseDurationSeconds(expiresIn)

  cookieStore.set(cookieName(), token, {
    httpOnly: true,
    maxAge,
    path: "/",
    priority: "high",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export async function clearRefreshToken(): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.set(cookieName(), "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    priority: "high",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

function parseDurationSeconds(value: string): number {
  const match = /^(\d+)(ms|s|m|h|d|w|y)$/.exec(value)

  if (!match) {
    return 30 * 24 * 60 * 60
  }

  const amount = Number(match[1])
  const unit = match[2]
  const secondsByUnit: Record<string, number> = {
    ms: 1 / 1000,
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
    w: 7 * 24 * 60 * 60,
    y: 365 * 24 * 60 * 60,
  }

  return Math.max(1, Math.floor(amount * secondsByUnit[unit]))
}

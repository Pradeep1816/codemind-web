import "server-only"

import { cookies } from "next/headers"

const DEVELOPMENT_COOKIE_NAME = "codexa_refresh"
const PRODUCTION_COOKIE_NAME = "__Host-codexa_refresh"
const LEGACY_DEVELOPMENT_COOKIE_NAME = "codemind_refresh"
const LEGACY_PRODUCTION_COOKIE_NAME = "__Host-codemind_refresh"

function cookieNames(): readonly [current: string, legacy: string] {
  return process.env.NODE_ENV === "production"
    ? [PRODUCTION_COOKIE_NAME, LEGACY_PRODUCTION_COOKIE_NAME]
    : [DEVELOPMENT_COOKIE_NAME, LEGACY_DEVELOPMENT_COOKIE_NAME]
}

export async function readRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const [currentName, legacyName] = cookieNames()

  return (
    cookieStore.get(currentName)?.value ??
    cookieStore.get(legacyName)?.value ??
    null
  )
}

export async function writeRefreshToken(
  token: string,
  expiresIn: string,
): Promise<void> {
  const cookieStore = await cookies()
  const [currentName, legacyName] = cookieNames()
  const maxAge = parseDurationSeconds(expiresIn)

  cookieStore.set(currentName, token, cookieOptions(maxAge))
  cookieStore.set(legacyName, "", cookieOptions(0))
}

export async function clearRefreshToken(): Promise<void> {
  const cookieStore = await cookies()
  const [currentName, legacyName] = cookieNames()

  cookieStore.set(currentName, "", cookieOptions(0))
  cookieStore.set(legacyName, "", cookieOptions(0))
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    priority: "high" as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  }
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

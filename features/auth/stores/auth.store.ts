"use client"

import { create } from "zustand"
import type {
  AuthenticatedUser,
  AuthSession,
} from "@/features/auth/schemas/auth.schema"

export type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthState {
  accessToken: string | null
  status: AuthStatus
  user: AuthenticatedUser | null
  clearSession: () => void
  setSession: (session: AuthSession) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  status: "loading",
  user: null,
  clearSession: () =>
    set({ accessToken: null, status: "unauthenticated", user: null }),
  setSession: (session) =>
    set({
      accessToken: session.accessToken,
      status: "authenticated",
      user: session.user,
    }),
}))

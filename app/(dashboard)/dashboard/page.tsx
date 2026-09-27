import type { Metadata } from "next"
import { RepositoriesPage } from "@/features/repositories/components/repositories-page"

export const metadata: Metadata = { title: "Dashboard" }

export default function DashboardPage() {
  return <RepositoriesPage />
}

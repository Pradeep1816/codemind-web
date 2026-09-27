import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RepositoryDetailPage } from "@/features/repositories/components/repository-detail-page"

export const metadata: Metadata = { title: "Repository" }

export default async function RepositoryPage({
  params,
}: PageProps<"/repositories/[repositoryId]">) {
  const repositoryId = Number((await params).repositoryId)

  if (!Number.isSafeInteger(repositoryId) || repositoryId < 1) {
    notFound()
  }

  return <RepositoryDetailPage repositoryId={repositoryId} />
}

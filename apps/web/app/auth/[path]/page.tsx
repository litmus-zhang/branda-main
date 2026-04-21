import { viewPaths } from "@better-auth-ui/react/core"
import { notFound } from "next/navigation"

import { Auth } from "@branda/ui/components/auth/auth"

export default async function AuthPage({
  params
}: {
  params: Promise<{
    path: string
  }>
}) {
  const { path } = await params
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  if (!Object.values(viewPaths.auth).includes(path)) {
    notFound()
  }

  return (
    <div className="flex justify-center my-auto p-4 md:p-6">
      <Auth path={path} socialLayout={"auto"} />
    </div>
  )
}
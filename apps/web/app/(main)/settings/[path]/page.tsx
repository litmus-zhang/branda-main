import { viewPaths } from "@better-auth-ui/react/core"
import { notFound } from "next/navigation"

import { Settings } from "@branda/ui/components/settings/settings"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function SettingsPage({
    params
}: {
    params: Promise<{
        path: string
    }>
}) {
    const { path } = await params

    if (!Object.values(viewPaths.settings).includes(path)) {
        notFound()
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
            <Link className="flex gap-2 inline-flex text-sm items-center p-3 rounded-full hover:bg-muted transition-colors mb-3" href="/dashboard">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <Settings path={path} />
        </div>
    )
}
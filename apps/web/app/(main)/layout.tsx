"use client"
import { useAuth } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * Auth Guard Layout for the (main) group.
 * Prevents unauthorized users from accessing dashboard pages.
 */
export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isSignedIn, isPending } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If the session check is finished and the user is NOT signed in, redirect to home
        if (!isPending && !isSignedIn) {
            router.replace("/");
        }
    }, [isSignedIn, isPending, router]);

    // Show a loading state while we verify the session
    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#050505]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-slate-400 text-sm font-medium animate-pulse">Verifying session...</p>
                </div>
            </div>
        );
    }

    // Secondary safety check: if not signed in, render nothing while redirecting
    if (!isSignedIn) {
        return null;
    }

    // Authenticated user: render the protected content
    return (
        <div className="min-h-screen flex flex-col">
            {children}
        </div>
    );
}

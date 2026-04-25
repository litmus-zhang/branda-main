"use client"
import { useAuth } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

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
        return <LoadingScreen message="Verifying session..." />;
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

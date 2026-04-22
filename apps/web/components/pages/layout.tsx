"use client"
import { useAuth } from "@/lib/auth-client";
import { Logo } from "@branda/ui/components/logo";
import { Bell, Calendar, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function AuthLayoutPage({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { session } = useAuth()
    const router = useRouter();

    useEffect(() => {

        if (!session) {
            router.replace("/")
        }
    })

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <div className="flex-1 flex flex-col gap-4 p-6 md:p-10 ">
                <div className="flex flex-col gap-2 md:justify-start">
                    <Logo className="text-primary" size={"md"} />
                </div>

                <div className="flex flex-col items-center justify-center my-20">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-600">Sign in to continue to your account</p>
                    <div className="w-full max-w-md">{children}</div>
                </div>
            </div>
        </div>
    );
}

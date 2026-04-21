"use client"
import { useAuthenticate } from "@better-auth-ui/react";
import { Logo } from "@branda/ui/components/logo";
import { Bell, Calendar, MessageSquare } from "lucide-react";
import Image from "next/image";


export default function AuthLayoutPage({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // const { data: session } = useAuthenticate()
    // const router = useRouter();

    // if (!session) {
    //     router.push("/")
    // }

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

            <div className="hidden lg:flex w-1/2 bg-teal-900 relative">
                <div className="absolute inset-0 bg-black/20 z-10"></div>
                <Image
                    alt="Community"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 z-0"
                    src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80"
                    fill
                    referrerPolicy="no-referrer"
                />
                <div className="relative z-20 flex flex-col justify-center p-12 text-white h-full">
                    <h2 className="text-4xl font-bold mb-6">Welcome to ENGAGE LAGOS</h2>
                    <p className="text-xl text-teal-50 mb-8">Connect with your community, stay informed, and participate in local initiatives.</p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Community Channels</h3>
                                <p className="text-teal-100 text-sm">Join discussions in your LGA</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <Bell className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Real-time Updates</h3>
                                <p className="text-teal-100 text-sm">Stay informed about local news</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Events & Programs</h3>
                                <p className="text-teal-100 text-sm">Discover community activities</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

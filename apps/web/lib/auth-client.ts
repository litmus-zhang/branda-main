import { emailOTPClient, } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    plugins: [
        emailOTPClient(),
    ],
    basePath: "/auth",
});


export async function getUser() {
    const { data } = await authClient.getSession()

    if (!data?.user) {
        throw new Error("User not authenticated")
    }

    return {
        user: data.user,
        session: data.session,
        // role : data.user.role,
        isAuthenticated: true,
    }
}


export const useAuth = () => {
    const { data, isPending } = authClient.useSession()


    return {

        user: data?.user,
        session: data?.session,
        isSignedIn: !!data?.user,
        isPending,
        getToken: async () => {
            const res = await authClient.getSession();
            return res.data?.session?.token;
        },
    }
}
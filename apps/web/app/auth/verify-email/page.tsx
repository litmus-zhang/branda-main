"use client";

import { authClient } from "@/lib/auth-client"; // better-auth-ui
import { useAuthenticate } from "@better-auth-ui/react"

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { Skeleton } from "@branda/ui/components/skeleton";

export default function VerifyEmail() {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <VerifyEmailContent />
      </Suspense>
    </>
  );
}
function VerifyEmailContent() {
  const { data: session } = useAuthenticate()

  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();


  useEffect(() => {
    if (token) {
      authClient.verifyEmail({ query: { token } })
        .then(() => console.log("Verified"))
        .catch(console.error);
    }
    router.push("/auth/sign-in");

  }, [token]);

  if (!session) {
    router.push("/auth/sign-in");
  }

  return (
    <>
      <div>
        <p>
          Now that your email is verified, you can continue using the application.
        </p>
        <Link href="/auth/sign-in" className="w-full my-2 p-2 rounded-lg text-white bg-primary">Continue to Login</Link>
      </div>
    </>
  );
}

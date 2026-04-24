"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@branda/ui/components/skeleton";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmail() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-32 rounded-xl" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const callbackURL = params.get("callbackURL") || "/auth/sign-in";
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const { error } = await authClient.verifyEmail({
          query: {
            token,
            callbackURL,
          }
        });

        if (error) {
          console.error("Verification error:", error);
          setStatus("error");
          toast.error(error.message || "Failed to verify email.");
        } else {
          setStatus("success");
          toast.success("Email verified successfully!");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setStatus("error");
        toast.error("An unexpected error occurred.");
      }
    }

    verify();
  }, [token, callbackURL]);

  return (
    <div className="flex flex-col gap-6 p-8 bg-card rounded-2xl border border-border shadow-sm min-w-[320px]">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse text-center">
            Verifying security credentials
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col gap-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="bg-emerald-500/10 p-4 rounded-full ring-8 ring-emerald-500/5">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">Verified</h2>
            <p className="text-xs text-muted-foreground font-bold italic">
              Your identity has been confirmed. You may now proceed.
            </p>
          </div>
          <Link 
            href="/auth/sign-in" 
            className="w-full mt-4 p-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white bg-primary hover:bg-primary/90 transition-all text-center shadow-2xl shadow-primary/20 active:scale-95"
          >
            Continue to Login
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col gap-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="bg-destructive/10 p-4 rounded-full ring-8 ring-destructive/5">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">Failed</h2>
            <p className="text-xs text-muted-foreground font-bold italic">
              The verification link is invalid or has expired.
            </p>
          </div>
          <Link 
            href="/auth/sign-in" 
            className="w-full mt-4 p-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white bg-primary hover:bg-primary/90 transition-all text-center shadow-2xl shadow-primary/20 active:scale-95"
          >
            Back to Sign In
          </Link>
        </div>
      )}
    </div>
  );
}

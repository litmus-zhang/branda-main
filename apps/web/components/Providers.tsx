'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "@branda/ui/components/auth/auth-provider"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import Link from "next/link"
import { ReactNode } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { queryClient } from '@/lib/queryClient';

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme()

  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute={["class", "data-mode"]}
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <AuthProvider
          authClient={authClient}
          appearance={{ theme, setTheme }}
          deleteUser={{ enabled: true }}
          // magicLink
          // multiSession
          redirectTo={`/dashboard`}
          queryClient={queryClient}

          baseURL={url}
          socialProviders={["google"]}
          navigate={({ to, replace }) =>
            replace ? router.replace(to) : router.push(to)
          }
          // passkey={true}
          Link={Link}
        >
          {children}
        </AuthProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}

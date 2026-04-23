'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "@branda/ui/components/auth/auth-provider"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import Link from "next/link"
import { ReactNode, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme()
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));
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
          redirectTo="/dashboard"
          // queryClient={queryClient}
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

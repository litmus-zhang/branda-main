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
          magicLink
          multiSession
          redirectTo="/dashboard"
          socialProviders={["google", "github"]}
          navigate={({ to, replace }) =>
            replace ? router.replace(to) : router.push(to)
          }
          Link={Link}
          // localizeErrors={false}
          emailVerification={true}
        >
          {children}
        </AuthProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}

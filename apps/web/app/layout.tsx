import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@branda/ui/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/Providers";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Branda | AI Business Builder",
  description: "Build your brand, marketing strategy, and systems with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

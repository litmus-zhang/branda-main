import { Geist, Geist_Mono, Inter } from "next/font/google"

import "@branda/ui/globals.css"
import Providers from "@/components/Providers"
import type { Metadata } from 'next'
import { Toaster } from "@branda/ui/components/sonner"


export const metadata: Metadata = {
  title: 'Branda - Making your business visible',
  description: 'Get your business up and running in minutes',
  creator: 'Dynage Technologies',
  icons: {
    icon: [

      {
        url: '/icon-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-touch-icon.png',
  },
}

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

import Clarity from "@/components/Clarity"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${inter.variable}   font-sans antialiased  `}
      >
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <Clarity projectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID} />
        )}
        <Providers>
          <Toaster richColors theme="dark" position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  )
}

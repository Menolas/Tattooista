import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/shared/providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Tattooista - Professional Tattoo Studio",
    template: "%s | Tattooista",
  },
  description:
    "Professional tattoo studio creating unique and personalized artwork. Book your consultation today.",
  keywords: ["tattoo", "tattoo studio", "custom tattoo", "tattoo artist"],
  authors: [{ name: "Tattooista" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Tattooista",
    title: "Tattooista - Professional Tattoo Studio",
    description:
      "Professional tattoo studio creating unique and personalized artwork. Book your consultation today.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

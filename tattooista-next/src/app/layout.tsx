import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/shared/providers"

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/shared/providers"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

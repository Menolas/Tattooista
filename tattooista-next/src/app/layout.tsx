import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/shared/providers"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Tattooista — The Platform for Modern Tattoo Studios",
    template: "%s | Tattooista",
  },
  description:
    "The all-in-one platform for tattoo studios. Launch your branded site, showcase your portfolio, and let clients book you.",
  keywords: ["tattoo", "tattoo studio", "custom tattoo", "tattoo artist", "tattoo booking", "tattoo platform"],
  authors: [{ name: "Tattooista" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Tattooista",
    title: "Tattooista — The Platform for Modern Tattoo Studios",
    description:
      "The all-in-one platform for tattoo studios. Launch your branded site, showcase your portfolio, and let clients book you.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

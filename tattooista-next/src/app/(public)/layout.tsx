import { Header } from "@/components/shared/header"
import { Contacts } from "@/components/shared/contacts"
import { Footer } from "@/components/shared/footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Contacts />
      <Footer />
    </div>
  )
}

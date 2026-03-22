import { Header } from "@/components/shared/header"
import { Contacts } from "@/components/shared/contacts"
import { Footer } from "@/components/shared/footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Contacts />
      <Footer />
    </>
  )
}

import { Header } from "@/components/shared/header"
import { Contacts } from "@/components/shared/contacts"
import { Footer } from "@/components/shared/footer"
import { getTenantContext } from "@/lib/tenant"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const studio = await getTenantContext()

  if (!studio) {
    return <main>{children}</main>
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Contacts />
      <Footer />
    </>
  )
}

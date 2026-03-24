import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminMobileNav } from "@/components/admin/mobile-nav"

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar slug={slug} />
      <AdminMobileNav slug={slug} />
      <div className="lg:pl-64">
        <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

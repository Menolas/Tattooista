"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const pathname = usePathname()
  // Extract /{slug}/admin from current path
  const adminBase = pathname.match(/^\/[^/]+\/admin/)?.[0] ?? "/"

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild>
        <Link href={adminBase}>Go to Dashboard</Link>
      </Button>
    </div>
  )
}

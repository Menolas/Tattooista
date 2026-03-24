"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Image,
  Star,
  Palette,
  Briefcase,
  HelpCircle,
  FileText,
  Settings,
  User,
  UserCog,
} from "lucide-react"

const navItems = [
  { title: "Dashboard", path: "", icon: LayoutDashboard },
  { title: "Bookings", path: "/bookings", icon: CalendarCheck },
  { title: "Clients", path: "/clients", icon: Users },
  { title: "Gallery", path: "/gallery", icon: Image },
  { title: "Styles", path: "/styles", icon: Palette },
  { title: "Services", path: "/services", icon: Briefcase },
  { title: "FAQ", path: "/faq", icon: HelpCircle },
  { title: "Pages", path: "/pages", icon: FileText },
]

const bottomNavItems = [
  { title: "Profile", path: "/profile", icon: User },
  { title: "Settings", path: "/settings", icon: Settings },
]

export function AdminSidebar({ slug }: { slug: string }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isSuperAdmin = session?.user?.platformRole === "PLATFORM_ADMIN"
  const base = `/${slug}/admin`

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow border-r bg-background pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <Link href="/" className="text-xl font-bold">
            Tattooista
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const href = `${base}${item.path}`
            const isActive = item.path === ""
              ? pathname === base
              : pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={item.path}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}

          {/* Superadmin only: Users */}
          {isSuperAdmin && (
            <Link
              href={`${base}/users`}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === `${base}/users` || pathname.startsWith(`${base}/users/`)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <UserCog className="h-4 w-4" />
              Users
            </Link>
          )}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t mt-auto pt-4 px-3">
          {bottomNavItems.map((item) => {
            const href = `${base}${item.path}`
            const isActive = pathname === href
            return (
              <Link
                key={item.path}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}

          {/* Back to Site */}
          <Link
            href={`/${slug}`}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors mt-2"
          >
            <Star className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </div>
    </aside>
  )
}

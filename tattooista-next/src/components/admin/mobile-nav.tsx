"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  Menu,
} from "lucide-react"

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { title: "Clients", href: "/admin/clients", icon: Users },
  { title: "Gallery", href: "/admin/gallery", icon: Image },
  { title: "Styles", href: "/admin/styles", icon: Palette },
  { title: "Services", href: "/admin/services", icon: Briefcase },
  { title: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { title: "Pages", href: "/admin/pages", icon: FileText },
]

export function AdminMobileNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isSuperAdmin = session?.user?.roles?.includes("SUPERADMIN")

  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-background">
      <Link href="/admin" className="text-lg font-bold">
        Tattooista
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <Link href="/admin" className="text-xl font-bold">
                Tattooista
              </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
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

              {isSuperAdmin && (
                <Link
                  href="/admin/users"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === "/admin/users" || pathname.startsWith("/admin/users/")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <UserCog className="h-4 w-4" />
                  Users
                </Link>
              )}
            </nav>

            <div className="border-t p-4 space-y-1">
              <Link
                href="/admin/profile"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === "/admin/profile"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/admin/settings"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === "/admin/settings"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Star className="h-4 w-4" />
                Back to Site
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

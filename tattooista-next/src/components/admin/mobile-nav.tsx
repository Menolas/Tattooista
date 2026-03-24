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
  { title: "Dashboard", path: "", icon: LayoutDashboard },
  { title: "Bookings", path: "/bookings", icon: CalendarCheck },
  { title: "Clients", path: "/clients", icon: Users },
  { title: "Gallery", path: "/gallery", icon: Image },
  { title: "Styles", path: "/styles", icon: Palette },
  { title: "Services", path: "/services", icon: Briefcase },
  { title: "FAQ", path: "/faq", icon: HelpCircle },
  { title: "Pages", path: "/pages", icon: FileText },
]

export function AdminMobileNav({ slug }: { slug: string }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isSuperAdmin = session?.user?.platformRole === "PLATFORM_ADMIN"
  const base = `/${slug}/admin`

  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-background">
      <Link href="/" className="text-lg font-bold">
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
              <Link href="/" className="text-xl font-bold">
                Tattooista
              </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
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

            <div className="border-t p-4 space-y-1">
              <Link
                href={`${base}/profile`}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === `${base}/profile`
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href={`${base}/settings`}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === `${base}/settings`
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Link
                href={`/${slug}`}
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

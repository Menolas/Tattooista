"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, LogIn, LayoutDashboard, Phone } from "lucide-react"
import { logout } from "@/lib/actions/auth"

const navItems = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/#about", label: "Tattoo Artist" },
  { href: "/#services", label: "Studio Services" },
  { href: "/#faq", label: "F.A.Q" },
  { href: "/#booking", label: "Booking" },
  { href: "/contacts", label: "Contacts" },
  { href: "/reviews", label: "Reviews" },
]

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  const isAdmin =
    session?.user?.roles?.includes("ADMIN") ||
    session?.user?.roles?.includes("SUPERADMIN")

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isMenuOpen])

  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center px-4 pt-[22px] md:px-[70px] md:pt-[42px] overflow-visible">
      {/* Logo */}
      <Link href="/" className="relative w-[50px] h-[50px] md:w-[55px] md:h-[88px] shrink-0">
        <Image
          src="/images/logo.png"
          alt="Tattooista"
          fill
          className="object-contain"
          priority
        />
      </Link>

      {/* Nav wrapper */}
      <div ref={navRef} className="relative ml-auto md:mx-auto lg:mx-[80px]">
        {/* Hamburger */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={`relative z-20 w-[44px] h-[28px] md:w-[60px] md:h-[38px] ${isMenuOpen ? "md:static fixed top-[22px] right-4" : ""}`}
        >
          {/* Top line */}
          <span
            className={`absolute right-0 top-0 h-[2px] bg-foreground transition-all duration-300 ${
              isMenuOpen
                ? "w-[50px] md:w-[69px] top-[13px] md:top-[18px] -right-[3px] md:-right-[5px] rotate-[32deg]"
                : "w-full"
            }`}
          />
          {/* Middle line */}
          <span
            className={`absolute right-0 top-1/2 -translate-y-1/2 h-[2px] bg-foreground transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : "w-[26px] md:w-[40px] md:left-0 md:right-auto"
            }`}
          />
          {/* Bottom line */}
          <span
            className={`absolute right-0 bottom-0 h-[2px] bg-foreground transition-all duration-300 ${
              isMenuOpen
                ? "w-[50px] md:w-[69px] bottom-[13px] md:bottom-[18px] -left-[3px] md:-left-[5px] -rotate-[32deg]"
                : "w-full md:w-[60px]"
            }`}
          />
        </button>

        {/* Desktop dropdown menu */}
        <ul
          className={`hidden md:flex flex-col gap-2 absolute bottom-[-10px] translate-y-full transition-all duration-[250ms] ease-in-out z-10 ${
            isMenuOpen
              ? "h-auto py-6 px-8 pr-14 before:content-[''] before:absolute before:inset-0 before:bg-[rgba(8,8,8,0.5)] before:shadow-[0_4px_30px_rgba(0,0,0,0.1)] before:backdrop-blur-[9px] before:border-2 before:border-[rgba(250,250,250,0.6)] before:-z-10"
              : "h-0 overflow-hidden"
          }`}
        >
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-[30px] capitalize tracking-[1.9px] whitespace-nowrap text-foreground no-underline hover:text-foreground/70 transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop right section */}
      <div className="hidden md:flex items-center gap-[50px] ml-auto">
        <nav className="flex items-center gap-[40px]">
          <a
            href="tel:+4745519015"
            className="flex items-center gap-4 text-foreground font-normal bg-transparent border-none hover:[&_svg]:scale-[1.2] transition-all duration-300"
          >
            <Phone className="w-[40px] h-[40px] transition-transform duration-300" />
            Call me
          </a>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-4 text-foreground font-normal hover:[&_svg]:scale-[1.2] transition-all duration-300"
            >
              <LayoutDashboard className="w-[40px] h-[40px] transition-transform duration-300" />
              Admin
            </Link>
          )}
          {session?.user ? (
            <>
              <Link
                href="/admin/profile"
                className="w-[50px] h-[50px] rounded-full overflow-hidden"
              >
                <Avatar className="w-full h-full">
                  <AvatarImage
                    src={session.user.avatar ? `/users/${session.user.id}/avatar/${session.user.avatar}` : undefined}
                    alt={session.user.displayName}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {session.user.displayName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 text-foreground font-normal border-none bg-transparent hover:[&_svg]:scale-[1.2] transition-all duration-300"
              >
                <LogOut className="w-[40px] h-[40px] transition-transform duration-300" />
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={() => window.location.href = "/login"}
              className="flex items-center gap-4 text-foreground font-normal border-none bg-transparent hover:[&_svg]:scale-[1.2] transition-all duration-300"
            >
              <LogIn className="w-[40px] h-[40px] transition-transform duration-300" />
              Log In
            </button>
          )}
        </nav>
      </div>

      {/* Mobile fullscreen menu */}
      <div
        className={`md:hidden fixed inset-0 z-10 bg-[#080808] bg-[url('/images/body-bg.jpg')] bg-no-repeat bg-cover p-[5rem_2rem] transition-transform duration-300 shadow-[0_3px_5px_5px_rgba(0,0,0,0.9)] ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[rgba(8,8,8,0.7)]" />

        <ul className="relative z-10 flex flex-col gap-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal no-underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="border-t border-foreground/10 pt-4 mt-2">
            {session?.user ? (
              <div className="flex flex-col gap-4">
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal"
                  >
                    <LayoutDashboard className="w-[30px] h-[30px]" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/admin/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal"
                >
                  <User className="w-[30px] h-[30px]" />
                  Profile
                </Link>
                <button
                  onClick={() => { setIsMenuOpen(false); handleLogout() }}
                  className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal bg-transparent border-none"
                >
                  <LogOut className="w-[30px] h-[30px]" />
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal"
              >
                <User className="w-[30px] h-[30px]" />
                Log In
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

const socialLinks = [
  {
    tooltipText: "My Instagram",
    url: "https://www.instagram.com/adelainehobf/",
    icon: "/icons/instagram.svg",
  },
  {
    tooltipText: "My Facebook",
    url: "https://www.facebook.com/a.hobf",
    icon: "/icons/facebook.svg",
  },
]

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  const isPortfolio = pathname.startsWith("/portfolio")

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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isMenuOpen])

  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center px-4 pt-[22px] min-[990px]:px-[70px] min-[990px]:pt-[42px] overflow-visible">
      {/* Logo */}
      <Link href="/" className="relative w-[50px] h-[50px] min-[990px]:w-[55px] min-[990px]:h-[88px] shrink-0">
        <Image
          src="/images/logo.png"
          alt="Tattooista"
          fill
          className="object-contain"
          priority
        />
      </Link>

      {/* Nav wrapper */}
      <div ref={navRef} className="relative ml-auto min-[990px]:mx-auto min-[1200px]:mx-[80px]">
        {/* Hamburger */}
        <div
          className={`hamburger ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
        </div>

        {/* Desktop dropdown menu */}
        <ul
          className={`hidden min-[990px]:flex flex-col gap-2 absolute bottom-[-10px] translate-y-full transition-all duration-[250ms] ease-in-out z-10 ${
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

      {/* Social nav — hidden on mobile, visible on desktop */}
      <nav className="hidden min-[990px]:block mr-4">
        <ul className="flex items-center gap-5 list-none m-0 p-0">
          {socialLinks.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.tooltipText}
                className="flex items-center no-underline"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={link.icon}
                  alt={link.tooltipText}
                  className="w-[40px] h-[40px] transition-transform duration-300 hover:scale-[1.2]"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop right section */}
      <div className="hidden min-[990px]:flex items-center gap-[50px] ml-auto">
        {/* Booking button — only on portfolio page */}
        {isPortfolio && (
          <Link
            href="/#booking"
            className="flex items-center justify-center px-[38px] h-[60px] min-[990px]:h-[60px] text-[20px] font-semibold tracking-[1px] text-foreground bg-transparent border-2 border-foreground whitespace-nowrap transition-all duration-300 hover:bg-foreground hover:text-background"
          >
            Book a consultation
          </Link>
        )}

        <nav className="flex items-center gap-[40px]">
          <a
            href="tel:+4745519015"
            className="flex items-center gap-4 text-foreground font-normal bg-transparent border-none hover:[&_svg]:scale-[1.2] transition-all duration-300"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/phone.svg"
              alt="Phone"
              className="w-[40px] h-[40px] transition-transform duration-300"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            Call me
          </a>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-4 text-foreground font-normal hover:[&_img]:scale-[1.2] transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/admin.svg"
                alt="Admin"
                className="w-[40px] h-[40px] transition-transform duration-300"
                style={{ filter: "brightness(0) invert(1)" }}
              />
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
                className="flex items-center gap-4 text-foreground font-normal border-none bg-transparent hover:[&_img]:scale-[1.2] transition-all duration-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/logout.svg"
                  alt="Log Out"
                  className="w-[40px] h-[40px] transition-transform duration-300"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={() => window.location.href = "/login"}
              className="flex items-center gap-4 text-foreground font-normal border-none bg-transparent hover:[&_img]:scale-[1.2] transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/login.svg"
                alt="Log In"
                className="w-[40px] h-[40px] transition-transform duration-300"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              Log In
            </button>
          )}
        </nav>
      </div>

      {/* Mobile fullscreen menu */}
      <div
        className={`min-[990px]:hidden fixed inset-0 z-10 bg-background bg-[url('/images/body-bg.jpg')] bg-no-repeat bg-cover p-[5rem_2rem] transition-transform duration-300 shadow-[0_3px_5px_5px_rgba(0,0,0,0.9)] ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute inset-0 bg-[rgba(8,8,8,0.7)]" />

        <ul className="relative z-10 flex flex-col gap-4 list-none m-0 p-0">
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
                    Admin
                  </Link>
                )}
                <Link
                  href="/admin/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal"
                >
                  Profile
                </Link>
                <button
                  onClick={() => { setIsMenuOpen(false); handleLogout() }}
                  className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal bg-transparent border-none"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal"
              >
                Log In
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  )
}

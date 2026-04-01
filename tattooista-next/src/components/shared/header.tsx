"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { logout } from "@/lib/actions/auth"

const navItems = [
  { path: "/portfolio", label: "Portfolio" },
  { path: "/#about", label: "Tattoo Artist" },
  { path: "/#services", label: "Studio Services" },
  { path: "/#faq", label: "F.A.Q" },
  { path: "/#booking", label: "Booking" },
  { path: "/contacts", label: "Contacts" },
  { path: "/reviews", label: "Reviews" },
]

function studioHref(path: string, slug: string) {
  if (path.startsWith("/#")) {
    return `/${slug}${path.slice(1)}`
  }
  return `/${slug}${path}`
}

interface HeaderProps {
  studioSlug: string
  logo?: string | null
  phone?: string | null
  instagram?: string | null
  facebook?: string | null
}

export function Header({ studioSlug, logo, phone, instagram, facebook }: HeaderProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  const isPortfolio = pathname.includes("/portfolio")

  const socialLinks = [
    instagram ? { tooltipText: "Instagram", url: instagram, icon: "/icons/instagram.svg" } : null,
    facebook ? { tooltipText: "Facebook", url: facebook, icon: "/icons/facebook.svg" } : null,
  ].filter(Boolean) as { tooltipText: string; url: string; icon: string }[]

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
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center px-4 pt-[22px] min-[990px]:px-[70px] min-[990px]:pt-5 overflow-visible">
      {/* Logo */}
      <Link href={`/${studioSlug}`} className="relative w-[50px] h-[50px] min-[990px]:w-[80px] min-[990px]:h-[88px] shrink-0">
        <Image
          src={logo || "/images/logo.png"}
          alt="Studio"
          fill
          className={`object-contain${studioSlug === "demo" ? " invert" : ""}`}
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
            <li key={item.path}>
              <Link
                href={studioHref(item.path, studioSlug)}
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
      {socialLinks.length > 0 && (
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
      )}

      {/* Desktop right section */}
      <div className="hidden min-[990px]:flex items-center gap-[50px] ml-auto">
        {/* Booking button — only on portfolio page */}
        {isPortfolio && (
          <Link
            href={studioHref("/#booking", studioSlug)}
            className="flex items-center justify-center px-[38px] h-[60px] min-[990px]:h-[60px] text-[20px] font-semibold tracking-[1px] text-foreground bg-transparent border-2 border-foreground whitespace-nowrap transition-all duration-300 hover:bg-foreground hover:text-background"
          >
            Book a consultation
          </Link>
        )}

        <nav className="flex items-center gap-[40px]">
          {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-4 text-foreground font-normal bg-transparent border-none hover:[&_svg]:scale-[1.2] transition-all duration-300"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/phone.svg"
              alt="Phone"
              className="w-[40px] h-[40px] transition-transform duration-300"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            Call us
          </a>
          )}
          {session?.user && (
            <>
              <Link
                href={session.user.studioSlug ? `/${session.user.studioSlug}/admin` : "/"}
                className="flex items-center gap-4 text-foreground font-normal hover:opacity-80 transition-all duration-300"
              >
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
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
                </div>
                Admin
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
            <li key={item.path}>
              <Link
                href={studioHref(item.path, studioSlug)}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal no-underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
          {session?.user && (
            <li className="border-t border-foreground/10 pt-4 mt-2">
              <div className="flex flex-col gap-4">
                <Link
                  href={session.user.studioSlug ? `/${session.user.studioSlug}/admin` : "/"}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal"
                >
                  Admin
                </Link>
                <button
                  onClick={() => { setIsMenuOpen(false); handleLogout() }}
                  className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal bg-transparent border-none"
                >
                  Log Out
                </button>
              </div>
            </li>
          )}
        </ul>
      </div>
    </header>
  )
}

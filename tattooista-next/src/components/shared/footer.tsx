import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="relative bg-cover bg-center py-16 md:py-20"
      style={{ backgroundImage: "url(/images/body-bg.jpg)" }}
    >
      <div className="container px-4 md:px-[70px]">
        <div className="flex flex-col items-center gap-8">
          {/* Logo + Social */}
          <div className="flex flex-col items-center gap-6">
            <Link href="/" className="relative h-[50px] w-[50px] md:h-[88px] md:w-[55px]">
              <Image
                src="/images/logo.png"
                alt="Tattooista"
                fill
                className="object-contain"
              />
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm font-medium text-foreground/60 tracking-wider">
            &copy; {currentYear} Tattooista. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

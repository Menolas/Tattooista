import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook } from "lucide-react"

export function Footer({ studioSlug }: { studioSlug?: string }) {
  return (
    <footer className="flex flex-col gap-5 py-[60px] font-medium text-[18px] md:font-semibold md:text-[30px] bg-[url('/images/body-bg.jpg')] bg-no-repeat bg-cover">
      <div className="container md:flex md:flex-row md:items-center md:justify-between">
        {/* Social: logo + icons */}
        <div className="flex flex-col gap-5 md:items-center md:order-1">
          <Link href="/" className="relative h-[88px] w-[55px]">
            <Image
              src="/images/logo.png"
              alt="Tattooista"
              fill
              className={`object-contain${studioSlug === "demo" ? " invert" : ""}`}
            />
          </Link>
          <nav className="mb-[25px] md:mb-0">
            <ul className="flex gap-5 list-none m-0 p-0">
              <li>
                <a
                  href="https://www.instagram.com/adelainehobf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-foreground/70 transition-colors"
                >
                  <Instagram className="w-[40px] h-[40px]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/a.hobf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-foreground/70 transition-colors"
                >
                  <Facebook className="w-[40px] h-[40px]" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Creator links */}
        <div className="flex flex-col gap-5 md:order-2">
          <a
            href="https://github.com/Menolas"
            target="_blank"
            rel="noreferrer"
            className="text-inherit no-underline"
          >
            Web Developer: Olena Christensen
          </a>
          <a
            href="https://www.linkedin.com/in/mariia-enhelke-b70b98267/"
            target="_blank"
            rel="noreferrer"
            className="text-inherit no-underline"
          >
            Web Designer: Mariia Enhelke
          </a>
        </div>

        {/* Copyright */}
        <div className="md:order-0">
          @ Tattoo Studio &quot;Adelaine Hobf&quot;
        </div>
      </div>
    </footer>
  )
}

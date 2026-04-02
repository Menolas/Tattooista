"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreateStudioForm } from "@/components/forms/create-studio-form"
import { OwnerLoginForm } from "@/components/forms/owner-login-form"

const features = [
  { num: "01", title: "Portfolio Gallery", desc: "Showcase your work beautifully. Filter by style — traditional, blackwork, watercolor, you name it." },
  { num: "02", title: "Online Booking", desc: "Let clients book directly. No more DM ping-pong. Automated confirmations and reminders." },
  { num: "03", title: "Client Management", desc: "Track client history, preferences, and build personal galleries. Make every return feel personal." },
  { num: "04", title: "Reviews & Social Proof", desc: "Collect and display testimonials. Let your satisfied clients do the talking." },
  { num: "05", title: "CMS Pages", desc: "Create custom pages — about, aftercare, policies. Full control, zero coding." },
  { num: "06", title: "Email Notifications", desc: "Automatic booking confirmations, reminders, and follow-ups. Stay connected effortlessly." },
]

const stats = [
  { value: "10K+", label: "Bookings Made" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "0%", label: "Commission Fees" },
  { value: "24/7", label: "Your Site Online" },
]

const checklist = [
  "Your own branded domain",
  "Mobile-first design",
  "SEO optimized pages",
  "Social media integration",
  "Analytics dashboard",
  "Priority support during pilot",
]

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    el.querySelectorAll(".landing-reveal").forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [])

  return ref
}

export function PlatformLanding() {
  const [dialogMode, setDialogMode] = useState<"login" | "register" | null>(null)
  const revealRef = useScrollReveal()

  const openLogin = useCallback(() => setDialogMode("login"), [])
  const openRegister = useCallback(() => setDialogMode("register"), [])
  const closeDialog = useCallback(() => setDialogMode(null), [])

  return (
    <div ref={revealRef}>
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-5 min-[990px]:px-[70px] bg-gradient-to-b from-[#080808]/95 to-transparent">
        <span className="font-display text-[28px] font-semibold tracking-[3px] uppercase">
          Tattooista
        </span>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[#c7c7c7] text-[13px] tracking-[1.5px] uppercase hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-[#c7c7c7] text-[13px] tracking-[1.5px] uppercase hover:text-foreground transition-colors">
            Pricing
          </a>
          <button
            type="button"
            onClick={openLogin}
            className="inline-flex items-center justify-center px-7 h-11 border-[1.5px] border-foreground text-[12px] font-semibold tracking-[1.5px] uppercase transition-all duration-300 hover:bg-foreground hover:text-background"
          >
            Sign In
          </button>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 pt-[140px] pb-[100px] min-[990px]:px-[70px] min-[990px]:pt-[160px] min-[990px]:pb-[120px] overflow-hidden">
        <div className="max-w-[1280px] mx-auto w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-foreground/25 text-[11px] tracking-[2px] uppercase text-[#c7c7c7] mb-10 animate-[fadeUp_0.8s_ease-out_both]">
            <span className="w-1.5 h-1.5 bg-foreground rounded-full animate-pulse" />
            Pilot Program Open
          </div>

          {/* Heading */}
          <h1 className="font-display text-[clamp(48px,8vw,120px)] font-normal leading-[0.9] tracking-[-1px] uppercase mb-8 max-w-[900px] animate-[fadeUp_0.8s_ease-out_0.15s_both]">
            Your Art<br />Deserves<br />A <em className="italic">Stage</em>
          </h1>

          {/* Sub */}
          <p className="text-lg leading-[1.7] text-[#c7c7c7] max-w-[520px] mb-12 animate-[fadeUp_0.8s_ease-out_0.3s_both]">
            The all-in-one platform for tattoo studios. Launch your branded site,
            showcase your portfolio, and let clients book you — without the tech headache.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 items-center mb-4 animate-[fadeUp_0.8s_ease-out_0.45s_both]">
            <button
              type="button"
              onClick={openRegister}
              className="inline-flex items-center justify-center px-12 h-[60px] bg-foreground text-background text-sm font-semibold tracking-[2px] uppercase border-2 border-foreground transition-all duration-300 hover:bg-transparent hover:text-foreground"
            >
              Get Early Access
            </button>
            <Link
              href="/demo"
              target="_blank"
              className="inline-flex items-center justify-center px-12 h-[60px] border-2 border-foreground/25 text-[#c7c7c7] text-sm font-semibold tracking-[2px] uppercase transition-all duration-300 hover:border-foreground hover:text-foreground"
            >
              See Demo
            </Link>
          </div>

          <p className="text-[13px] text-muted-foreground animate-[fadeUp_0.8s_ease-out_0.55s_both]">
            Free during pilot. No credit card required.
          </p>
        </div>

        {/* Decorative line */}
        <div className="hidden min-[1200px]:block absolute right-[70px] top-1/2 -translate-y-1/2 w-px h-[200px] bg-gradient-to-b from-transparent via-foreground/25 to-transparent" />
      </section>

      {/* ── Stats ── */}
      <section className="border-t border-b border-border py-12">
        <div className="max-w-[1280px] mx-auto px-4 min-[990px]:px-[70px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-[42px] font-normal tracking-[-1px]">{s.value}</div>
                <div className="text-[12px] tracking-[2px] uppercase text-muted-foreground mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 min-[990px]:py-[120px]">
        <div className="max-w-[1280px] mx-auto px-4 min-[990px]:px-[70px]">
          <div className="landing-reveal">
            <div className="relative pl-8 text-[11px] tracking-[3px] uppercase text-muted-foreground mb-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-5 before:h-px before:bg-muted-foreground">
              What You Get
            </div>
          </div>
          <h2 className="landing-reveal font-display text-[clamp(32px,5vw,55px)] font-normal uppercase tracking-[2px] mb-4">
            Everything You Need
          </h2>
          <p className="landing-reveal text-[17px] leading-[1.7] text-[#c7c7c7] max-w-[560px] mb-[72px]">
            Built by people who understand the industry. No fluff, just the tools that matter.
          </p>

          <div className="landing-reveal landing-features-grid">
            {features.map((f) => (
              <div
                key={f.num}
                className="bg-background p-12 transition-colors duration-400 hover:bg-card"
              >
                <div className="font-display text-[32px] font-normal text-muted-foreground opacity-30 mb-6">
                  {f.num}
                </div>
                <h3 className="text-[15px] font-semibold tracking-[1.5px] uppercase mb-3.5">
                  {f.title}
                </h3>
                <p className="text-[15px] leading-[1.7] text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Showcase ── */}
      <section className="pb-[120px]">
        <div className="max-w-[1280px] mx-auto px-4 min-[990px]:px-[70px]">
          <div className="landing-reveal grid grid-cols-1 min-[990px]:grid-cols-2 border border-border">
            {/* Image side */}
            <div className="h-[400px] min-[990px]:h-auto min-[990px]:min-h-[560px] bg-secondary flex items-center justify-center overflow-hidden">
              <span className="font-display text-[140px] font-light text-foreground/[0.04] uppercase tracking-[8px] select-none">
                INK
              </span>
            </div>
            {/* Content side */}
            <div className="p-[60px_36px] min-[990px]:p-[80px_64px] flex flex-col justify-center">
              <div className="relative pl-8 text-[11px] tracking-[3px] uppercase text-muted-foreground mb-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-5 before:h-px before:bg-muted-foreground">
                Built for Artists
              </div>
              <h2 className="font-display text-[clamp(28px,4vw,45px)] font-normal uppercase tracking-[2px] leading-[1.1] mb-7">
                Focus on<br />Your Craft
              </h2>
              <p className="text-base leading-[1.8] text-[#c7c7c7] mb-9">
                We built this platform because talented artists shouldn&apos;t struggle with
                clunky websites and lose clients to no-shows.
              </p>
              <ul className="flex flex-col gap-3.5 mb-12">
                {checklist.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#c7c7c7] tracking-[0.5px]">
                    <span className="w-5 h-px bg-muted-foreground shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={openRegister}
                className="self-start inline-flex items-center justify-center px-12 h-[60px] bg-foreground text-background text-sm font-semibold tracking-[2px] uppercase border-2 border-foreground transition-all duration-300 hover:bg-transparent hover:text-foreground"
              >
                Create Your Studio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 min-[990px]:py-[120px] border-t border-border">
        <div className="max-w-[1280px] mx-auto px-4 min-[990px]:px-[70px]">
          <div className="text-center mb-[72px]">
            <div className="landing-reveal inline-flex relative pl-8 text-[11px] tracking-[3px] uppercase text-muted-foreground mb-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-5 before:h-px before:bg-muted-foreground">
              Pricing
            </div>
            <h2 className="landing-reveal font-display text-[clamp(32px,5vw,55px)] font-normal uppercase tracking-[2px] mb-4">
              Simple, Transparent
            </h2>
            <p className="landing-reveal text-[17px] leading-[1.7] text-[#c7c7c7] max-w-[560px] mx-auto">
              No hidden fees. No commission on your bookings. Ever.
            </p>
          </div>

          <div className="landing-reveal grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
            {/* Free */}
            <div className="border border-border p-12 transition-colors hover:border-foreground/25">
              <h3 className="text-[12px] tracking-[2px] uppercase text-muted-foreground mb-5">Free</h3>
              <div className="font-display text-[52px] font-normal mb-2">
                $0 <span className="text-lg text-muted-foreground">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground leading-[1.6] mb-8">
                Everything you need to get started.
              </p>
              <ul className="flex flex-col gap-3 mb-10 border-t border-border pt-7">
                {["Studio website with your branding", "Portfolio gallery", "Online booking form", "Up to 50 bookings/month", "Email notifications"].map((f) => (
                  <li key={f} className="text-sm text-[#c7c7c7] pl-6 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={openRegister}
                className="w-full inline-flex items-center justify-center h-[60px] border-2 border-foreground/25 text-[#c7c7c7] text-sm font-semibold tracking-[2px] uppercase transition-all duration-300 hover:border-foreground hover:text-foreground"
              >
                Get Started
              </button>
            </div>

            {/* Pro */}
            <div className="border border-foreground p-12 relative transition-colors">
              <span className="absolute top-[-1px] left-9 px-3.5 py-1 bg-foreground text-background text-[10px] font-bold tracking-[2px]">
                RECOMMENDED
              </span>
              <h3 className="text-[12px] tracking-[2px] uppercase text-muted-foreground mb-5">Pro</h3>
              <div className="font-display text-[52px] font-normal mb-2">
                $29 <span className="text-lg text-muted-foreground">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground leading-[1.6] mb-8">
                For studios ready to grow.
              </p>
              <ul className="flex flex-col gap-3 mb-10 border-t border-border pt-7">
                {["Everything in Free", "Custom domain", "Unlimited bookings", "Client management & history", "Analytics dashboard", "Priority support"].map((f) => (
                  <li key={f} className="text-sm text-[#c7c7c7] pl-6 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={openRegister}
                className="w-full inline-flex items-center justify-center h-[60px] bg-foreground text-background text-sm font-semibold tracking-[2px] uppercase border-2 border-foreground transition-all duration-300 hover:bg-transparent hover:text-foreground"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 min-[990px]:py-[120px] border-t border-border text-center">
        <div className="max-w-[1280px] mx-auto px-4 min-[990px]:px-[70px]">
          <div className="landing-reveal inline-flex relative pl-8 text-[11px] tracking-[3px] uppercase text-muted-foreground mb-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-5 before:h-px before:bg-muted-foreground">
            Ready?
          </div>
          <h2 className="landing-reveal font-display text-[clamp(36px,6vw,80px)] font-normal uppercase tracking-[2px] mb-6">
            Let Your<br />Art Speak
          </h2>
          <p className="landing-reveal text-[17px] text-[#c7c7c7] max-w-[480px] mx-auto mb-12 leading-[1.7]">
            Join our pilot program. Be among the first to launch your studio on Tattooista.
          </p>
          <button
            type="button"
            onClick={openRegister}
            className="landing-reveal inline-flex items-center justify-center px-12 h-[60px] bg-foreground text-background text-sm font-semibold tracking-[2px] uppercase border-2 border-foreground transition-all duration-300 hover:bg-transparent hover:text-foreground"
          >
            Join Pilot
          </button>
          <p className="landing-reveal text-[13px] text-muted-foreground mt-5">
            Pilot members get 6 months free + lifetime early-adopter pricing.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-12">
        <div className="max-w-[1280px] mx-auto px-4 min-[990px]:px-[70px] flex justify-between items-center flex-wrap gap-4">
          <span className="font-display text-lg font-semibold tracking-[2px] uppercase text-muted-foreground">
            Tattooista
          </span>
          <div className="flex gap-6">
            <a href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
          <span className="text-[13px] text-muted-foreground">&copy; 2026 Tattooista</span>
        </div>
      </footer>

      {/* ── Auth Dialog ── */}
      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md border-border bg-background">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center font-display uppercase tracking-wider">
              {dialogMode === "login" ? "Welcome Back" : "Create Your Studio"}
            </DialogTitle>
          </DialogHeader>

          {dialogMode === "login" ? (
            <>
              <OwnerLoginForm />
              <p className="text-center text-sm text-muted-foreground mt-4">
                Don&apos;t have a studio yet?{" "}
                <button
                  type="button"
                  onClick={openRegister}
                  className="text-foreground hover:underline"
                >
                  Create one
                </button>
              </p>
            </>
          ) : dialogMode === "register" ? (
            <>
              <CreateStudioForm />
              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have a studio?{" "}
                <button
                  type="button"
                  onClick={openLogin}
                  className="text-foreground hover:underline"
                >
                  Sign in
                </button>
              </p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

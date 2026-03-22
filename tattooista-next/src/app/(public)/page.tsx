export const dynamic = "force-dynamic"

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { requireTenantContext } from "@/lib/tenant"
import { BookingForm } from "@/components/forms/booking-form"
import { PortfolioSlider } from "@/components/shared/portfolio-slider"
import { ReadMore } from "@/components/shared/read-more"
import { FaqItem } from "@/components/shared/faq-item"
import { Instagram, Facebook } from "lucide-react"
import { pageWallpaperUrl, serviceWallpaperUrl } from "@/lib/image-utils"

async function getHomePageData() {
  const studio = await requireTenantContext()

  const [services, faqItems, aboutPage, tattooStyles] = await Promise.all([
    prisma.service.findMany({
      where: { studioId: studio.id },
      orderBy: { order: "asc" },
      take: 6,
    }),
    prisma.faqItem.findMany({
      where: { studioId: studio.id },
      orderBy: { order: "asc" },
      take: 5,
    }),
    prisma.page.findUnique({
      where: { studioId_name: { studioId: studio.id, name: "about" } },
    }),
    prisma.tattooStyle.findMany({
      where: { studioId: studio.id, isArchived: false, wallPaper: { not: null } },
      orderBy: { createdAt: "asc" },
    }),
  ])

  return { services, faqItems, aboutPage, tattooStyles }
}

export default async function HomePage() {
  const { services, faqItems, aboutPage, tattooStyles } = await getHomePageData()

  return (
    <div>
      {/* Hero / Main Offer */}
      <section
        className="relative flex flex-col items-start h-[432px] md:h-screen pt-[107px] px-4 md:pt-[270px] md:px-[70px] md:pb-[93px] overflow-visible bg-no-repeat bg-[length:360px_337px,cover] md:bg-[length:contain,cover] bg-[position:top_95px_right_-25px,center] md:bg-[position:bottom_0_right_0,top_center] bg-[url('/images/offerIllustration.png'),url('/images/body-bg.jpg')]"
      >
        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-[111px] md:h-[187px] bg-gradient-to-t from-[#080808] to-transparent" />

        {/* Content */}
        <div className="relative pl-[28px] md:pl-[66px] uppercase leading-none">
          {/* Decorative rotated text */}
          <span className="absolute -left-[40px] top-[42px] md:-left-[68px] md:top-[74px] text-[10px] md:text-[18px] font-medium md:font-semibold text-[#c7c7c7] tracking-[1.5px] -rotate-90 before:content-[''] before:absolute before:w-[21px] md:before:w-[45px] before:h-[2px] before:bg-[#c7c7c7] before:top-1/2 before:-left-[5px] md:before:-left-[10px] before:-translate-x-full before:-translate-y-1/2">
            Tattoo Artist
          </span>

          <h1 className="flex flex-col text-left text-[46px] md:text-[130px] font-bold leading-[0.9] m-0 [text-shadow:2px_2px_3px_rgba(0,0,0,0.8)]">
            <span>Hobf</span>
            <span>Adelaine</span>
          </h1>

          <span className="block py-[22px] md:py-0 md:mt-[14px] w-[140px] md:w-auto text-[13px] md:text-[30px] font-normal text-[#c7c7c7] leading-[15.85px] md:leading-normal tracking-[0.6px] md:tracking-[1px] md:text-right">
            Your philosophy on your skin
          </span>
        </div>

        {/* Booking button - centered bottom on mobile, static on desktop */}
        <a
          href="#booking"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[70%] z-10 max-w-[calc(100%-2rem)] md:relative md:bottom-auto md:left-auto md:translate-x-0 md:translate-y-0 md:mt-[82px] inline-flex items-center justify-center border-2 border-foreground px-[38px] md:px-[89px] h-[60px] md:h-[114px] md:w-[550px] text-[20px] md:text-[35px] font-semibold text-foreground transition-all duration-300 hover:bg-foreground hover:text-background whitespace-nowrap"
        >
          Book a consultation
        </a>
      </section>

      {/* Portfolio Slider */}
      {tattooStyles.length > 0 && (
        <section className="container pt-[80px] md:pt-[112px] pb-[70px] md:pb-[112px]">
          <h2 className="text-center text-[30px] md:text-[55px] font-bold uppercase tracking-wider mb-10 md:mb-[100px]">
            Portfolio
          </h2>
          <PortfolioSlider styles={tattooStyles} />
        </section>
      )}

      {/* About Section */}
      {aboutPage && aboutPage.isActive && (
        <section id="about" className="container relative py-[70px] md:py-[112px] md:pb-[70px] text-center">
          <h2 className="text-center text-[30px] md:text-[55px] font-bold uppercase tracking-wider mb-10 md:mb-[62px]">
            {aboutPage.title || "Tattoo Artist"}
          </h2>
          <div className="md:flex md:gap-[4%]">
            {/* Image with decorative border */}
            <div className="relative mx-auto mb-[45px] md:mb-0 md:mt-[42px] w-full md:w-[40%] h-[calc(100vw-2rem)] md:h-[400px] border-2 border-foreground">
              <div
                className="relative mx-auto w-[calc(100%-44px)] md:w-[calc(100%-84px)] h-full bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-300 -translate-y-[22px] md:-translate-y-[42px] z-10"
                style={{
                  backgroundImage: aboutPage.wallPaper
                    ? `url(${pageWallpaperUrl(aboutPage.id, aboutPage.wallPaper)})`
                    : "url(/images/body-bg.jpg)",
                }}
              />
            </div>
            {/* Content */}
            <div className="md:w-[56%]">
              <h3 className="text-left text-[25px] md:text-[43px] font-semibold mb-5">Facts about me</h3>
              {aboutPage.content && (
                <div className="text-left text-lg md:text-[26px] leading-[1.7] [&_p]:mb-4">
                  <ReadMore id="text-about" text={aboutPage.content} amountOfWords={36} />
                </div>
              )}
              <div className="mt-[40px]">
                <h3 className="text-left text-[25px] md:text-[43px] font-semibold mb-5">Follow me</h3>
                <nav className="flex gap-5 mb-[40px]">
                  <a
                    href="https://www.instagram.com/adelainehobf/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-foreground/70 transition-colors"
                  >
                    <Instagram className="w-[70px] h-[70px]" />
                  </a>
                  <a
                    href="https://www.facebook.com/a.hobf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-foreground/70 transition-colors"
                  >
                    <Facebook className="w-[70px] h-[70px]" />
                  </a>
                </nav>
                <a
                  href="#booking"
                  className="flex items-center justify-center border-2 border-foreground bg-transparent px-[38px] w-full md:w-fit h-[60px] md:h-[71px] text-[20px] md:text-[24px] font-semibold md:font-bold tracking-[1px] whitespace-nowrap transition-all duration-300 hover:bg-foreground hover:text-background"
                >
                  Book a consultation
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <section id="services" className="container py-[70px] md:py-[112px] bg-none">
          <h2 className="text-center text-[30px] md:text-[55px] font-bold uppercase tracking-wider mb-10 md:mb-[100px]">
            Studio services
          </h2>
          <div className="flex flex-wrap gap-x-[4%] gap-y-[20px] md:gap-x-[8%] md:gap-y-[88px] mx-auto w-full md:max-w-[1102px]">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`w-full md:w-[46%] md:min-w-[46%] md:max-w-[46%] flex justify-center ${index % 2 === 1 ? "md:mt-[110px]" : ""}`}
              >
                <article className="relative w-full pl-[20px]">
                  <span
                    className="absolute top-0 left-0 text-[13px] font-semibold z-10 origin-[0_0]"
                    style={{ transform: "rotate(-90deg) translateX(-100%)" }}
                  >
                    <span className="relative before:content-[''] before:absolute before:w-[9px] before:h-[2px] before:bg-foreground before:left-[-8px] before:top-1/2 before:-translate-x-full before:-translate-y-1/2">
                      {`0${index + 1}`}
                    </span>
                  </span>
                  <div
                    className="h-[300px] max-w-full bg-cover bg-center bg-[url('/images/service.png')] grayscale transition-all duration-300 hover:grayscale-0 mb-[42px]"
                    style={{
                      backgroundImage: service.wallPaper
                        ? `url(${serviceWallpaperUrl(service.id, service.wallPaper)})`
                        : undefined,
                    }}
                  />
                  <h4 className="mt-0 mb-[20px] text-[24px]">
                    {service.title}
                  </h4>
                  {service.conditions && (
                    <ul className="list-none m-0 p-0 pl-[20px] flex flex-col gap-y-1">
                      {service.conditions.split("\n").filter(Boolean).map((item, i) => (
                        <li
                          key={i}
                          className="relative tracking-[0.7px] font-normal before:content-[''] before:absolute before:block before:w-[2px] before:h-[2px] before:bg-foreground before:left-[-16px] before:top-1/2 before:-translate-y-1/2"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqItems.length > 0 && (
        <section
          id="faq"
          className="relative pt-[70px] md:pt-[112px] pb-[70px] md:pb-[100px] bg-cover bg-no-repeat bg-[position:top_26px_center] bg-[url('/images/body-bg.jpg')] overflow-visible before:content-[''] before:absolute before:block before:w-full before:h-[111px] before:left-0 before:right-0 before:top-[26px] before:z-0 before:bg-gradient-to-b before:from-[#080808] before:to-transparent after:content-[''] after:absolute after:block after:w-full after:h-[111px] after:left-0 after:right-0 after:bottom-0 after:z-0 after:bg-gradient-to-t after:from-[#080808] after:to-transparent"
        >
          <div className="container relative min-h-[700px] md:min-h-[800px] overflow-visible">
            <h2 className="text-center text-[30px] md:text-[55px] font-bold uppercase tracking-wider mb-10 md:mb-[100px]">
              F.A.Q
            </h2>
            <ul className="flex flex-col mx-auto w-[calc(100%-2rem)] md:w-[1000px] list-none m-0 p-0">
              {faqItems.map((item) => (
                <FaqItem key={item.id} question={item.question} answer={item.answer} />
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Booking Section */}
      <section id="booking" className="py-[70px] md:py-[112px]">
        <h2 className="text-center text-[30px] md:text-[55px] font-bold uppercase tracking-wider mb-10 md:mb-[100px] px-4 md:px-[70px]">
          Apply for booking
        </h2>
        <div className="flex w-full md:w-[1230px] md:mx-auto">
          {/* Form side */}
          <div
            className="w-full md:w-[615px] px-4 py-[60px] md:py-[80px] md:pl-[60px] md:pr-[97px] bg-[#fafafa] bg-[url('/images/form-background.png')] bg-no-repeat bg-cover"
          >
            <h3 className="text-[20px] md:text-[33px] font-bold text-[#080808] mb-[27px] md:mb-[47px] uppercase">
              Fill the form and we will contact you soon
            </h3>
            <div className="[&_label]:text-[#080808] [&_label]:uppercase [&_label]:text-xs md:[&_label]:text-sm [&_label]:font-semibold md:[&_label]:font-bold [&_label]:tracking-wider [&_input]:bg-transparent [&_input]:border-0 [&_input]:border-b-2 [&_input]:border-[#080808]/70 [&_input]:rounded-none [&_input]:text-[#080808] [&_input]:font-semibold [&_input]:text-lg md:[&_input]:text-xl [&_input]:placeholder:text-[#6F6D6D] [&_input]:placeholder:font-medium [&_textarea]:bg-transparent [&_textarea]:border-2 [&_textarea]:border-[#080808]/70 [&_textarea]:rounded-none [&_textarea]:text-[#080808] [&_textarea]:font-semibold [&_textarea]:text-lg md:[&_textarea]:text-xl [&_textarea]:placeholder:text-[#6F6D6D] [&_textarea]:placeholder:font-medium [&_textarea]:min-h-[105px] [&_button[type=submit]]:bg-[#080808] [&_button[type=submit]]:text-[#fafafa] [&_button[type=submit]]:border-2 [&_button[type=submit]]:border-[#080808] [&_button[type=submit]]:font-semibold [&_button[type=submit]]:text-xl md:[&_button[type=submit]]:text-[30px] [&_button[type=submit]]:h-[60px] md:[&_button[type=submit]]:h-[103px] [&_button[type=submit]]:mt-[30px] [&_button[type=submit]]:hover:bg-[#fafafa] [&_button[type=submit]]:hover:text-[#080808] [&_p]:text-[#961010]">
              <BookingForm />
            </div>
          </div>
          {/* Image side - desktop only */}
          <div
            className="hidden md:block w-[615px] bg-cover bg-[position:top_-120px_left] bg-no-repeat bg-[url('/images/booking.jpg')]"
          />
        </div>
      </section>
    </div>
  )
}


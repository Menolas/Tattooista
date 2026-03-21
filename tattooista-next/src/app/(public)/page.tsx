export const dynamic = "force-dynamic"

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { BookingForm } from "@/components/forms/booking-form"

async function getHomePageData() {
  const [services, faqItems, aboutPage, galleryItems] = await Promise.all([
    prisma.service.findMany({
      orderBy: { order: "asc" },
      take: 6,
    }),
    prisma.faqItem.findMany({
      orderBy: { order: "asc" },
      take: 5,
    }),
    prisma.page.findUnique({
      where: { name: "about" },
    }),
    prisma.galleryItem.findMany({
      where: { isArchived: false },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ])

  return { services, faqItems, aboutPage, galleryItems }
}

export default async function HomePage() {
  const { services, faqItems, aboutPage, galleryItems } = await getHomePageData()

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

      {/* Portfolio Preview */}
      {galleryItems.length > 0 && (
        <section className="py-[70px] md:py-[112px] px-4 md:px-[70px]">
          <h2 className="text-center text-[30px] md:text-[55px] font-bold uppercase tracking-wider mb-10 md:mb-16">
            Portfolio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="group relative h-[320px] md:h-[440px] overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/gallery/${item.fileName}`}
                  alt="Tattoo artwork"
                  className="h-full w-full object-cover grayscale transition-all duration-300 ease-in-out group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center border-2 border-foreground px-8 h-[60px] text-base font-extrabold uppercase tracking-wider transition-all duration-300 hover:bg-foreground hover:text-background"
            >
              View all works
            </Link>
          </div>
        </section>
      )}

      {/* About Section */}
      {aboutPage && aboutPage.isActive && (
        <section className="py-[70px] md:py-[112px] px-4 md:px-[70px]">
          <h2 className="text-center text-[30px] md:text-[55px] font-bold uppercase tracking-wider mb-10 md:mb-16">
            {aboutPage.title || "About"}
          </h2>
          <div className="max-w-3xl mx-auto">
            {aboutPage.content && (
              <p className="text-lg md:text-xl font-normal leading-relaxed text-foreground/80 whitespace-pre-wrap text-center">
                {aboutPage.content}
              </p>
            )}
            <div className="text-center mt-10">
              <a
                href="#booking"
                className="inline-flex items-center justify-center border-2 border-foreground px-8 h-[60px] text-base font-extrabold uppercase tracking-wider transition-all duration-300 hover:bg-foreground hover:text-background"
              >
                Book a consultation
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <section className="py-[70px] md:py-[112px] px-4 md:px-[70px]">
          <h2 className="text-center text-[30px] md:text-[55px] font-bold uppercase tracking-wider mb-10 md:mb-16">
            Studio services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[8%] gap-y-12">
            {services.map((service, index) => (
              <article
                key={service.id}
                className={`relative ${index % 2 === 1 ? "md:mt-16" : ""}`}
              >
                <span className="block text-[60px] md:text-[80px] font-bold leading-none text-foreground/10 mb-2">
                  {`0${index + 1}`}
                </span>
                <div
                  className="h-[200px] md:h-[300px] bg-cover bg-center grayscale transition-all duration-300 hover:grayscale-0 mb-6"
                  style={{
                    backgroundImage: service.wallPaper
                      ? `url(/services/${service.wallPaper})`
                      : "url(/images/service.png)",
                  }}
                />
                <h4 className="text-xl md:text-2xl font-semibold mb-4">
                  {service.title}
                </h4>
                {service.conditions && (
                  <p className="text-base md:text-lg text-foreground/70 whitespace-pre-wrap leading-relaxed">
                    {service.conditions}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqItems.length > 0 && (
        <section
          className="py-[70px] md:py-[112px] bg-cover bg-center bg-no-repeat bg-[url('/images/body-bg.jpg')]"
        >
          <div className="px-4 md:px-[70px]">
            <h2 className="text-center text-[30px] md:text-[55px] font-bold uppercase tracking-wider mb-10 md:mb-16">
              F.A.Q
            </h2>
            <div className="max-w-3xl mx-auto space-y-0">
              {faqItems.map((item) => (
                <FaqItem key={item.id} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Section */}
      <section id="booking" className="py-[70px] md:py-[112px]">
        <h2 className="text-center text-[30px] md:text-[55px] font-bold uppercase tracking-wider mb-10 md:mb-16 px-4 md:px-[70px]">
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

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-b border-foreground/10">
      <summary className="flex items-center justify-between cursor-pointer py-5 md:py-6 list-none">
        <h5 className="text-base md:text-lg font-semibold uppercase tracking-wider pr-4">
          {question}
        </h5>
        <span className="relative w-5 h-5 flex-shrink-0">
          <span className="absolute top-1/2 left-0 w-full h-[2px] bg-foreground -translate-y-1/2 transition-transform duration-300" />
          <span className="absolute top-1/2 left-0 w-full h-[2px] bg-foreground -translate-y-1/2 rotate-90 transition-transform duration-300 group-open:rotate-0" />
        </span>
      </summary>
      <p className="pb-6 text-base md:text-lg text-foreground/70 leading-relaxed whitespace-pre-wrap">
        {answer}
      </p>
    </details>
  )
}

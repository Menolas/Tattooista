export const dynamic = "force-dynamic"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingForm } from "@/components/forms/booking-form"
import { prisma } from "@/lib/prisma"
import { ChevronRight } from "lucide-react"

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
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Professional Tattoo Artistry
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Creating unique and personalized tattoo designs that tell your story.
              Book a consultation to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="#booking">Book Consultation</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/portfolio">View Portfolio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      {galleryItems.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Recent Work</h2>
              <Button variant="ghost" asChild>
                <Link href="/portfolio">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="aspect-square relative overflow-hidden rounded-lg bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/gallery/${item.fileName}`}
                    alt="Tattoo artwork"
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  {service.conditions && (
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {service.conditions}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {aboutPage && aboutPage.isActive && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {aboutPage.title || "About Us"}
              </h2>
              {aboutPage.content && (
                <div className="prose prose-lg dark:prose-invert mx-auto">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {aboutPage.content}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqItems.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {item.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Section */}
      <section id="booking" className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              Book a Consultation
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Ready to get your next tattoo? Fill out the form below and we&apos;ll get
              back to you shortly.
            </p>
            <Card>
              <CardContent className="pt-6">
                <BookingForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

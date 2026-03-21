import { Metadata } from "next"

export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingForm } from "@/components/forms/booking-form"
import { MapPin, Mail, Phone, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us or book your tattoo consultation.",
}

async function getContactsPageData() {
  const contactsPage = await prisma.page.findUnique({
    where: { name: "contacts" },
  })

  return contactsPage
}

export default async function ContactsPage() {
  const contactsPage = await getContactsPageData()

  return (
    <div className="py-12 md:py-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or ready to book your consultation?
            We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactsPage?.title && (
              <h2 className="text-2xl font-semibold">{contactsPage.title}</h2>
            )}

            {contactsPage?.content && (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {contactsPage.content}
              </p>
            )}

            <div className="space-y-4 mt-8">
              <Card>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-sm text-muted-foreground">
                      Studio Address, City, State ZIP
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      contact@tattooista.com
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-sm text-muted-foreground">
                      +1 (555) 000-0000
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Hours</h3>
                    <p className="text-sm text-muted-foreground">
                      Mon - Sat: 10AM - 7PM<br />
                      Sunday: By appointment
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Book a Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Mail, Phone, Instagram } from "lucide-react"
import { clientAvatarUrl, clientGalleryImageUrl } from "@/lib/image-utils"

export const metadata: Metadata = {
  title: "Client Details",
}

interface ClientPageProps {
  params: Promise<{ id: string }>
}

async function getClient(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      contacts: true,
      gallery: true,
    },
  })

  return client
}

const contactIcons: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params
  const client = await getClient(id)

  if (!client) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/clients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{client.fullName}</h1>
          <p className="text-muted-foreground">Client profile</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={client.avatar ? clientAvatarUrl(client.id, client.avatar) : undefined}
                  alt={client.fullName}
                />
                <AvatarFallback className="text-2xl">
                  {client.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{client.fullName}</h2>
              {client.isFavourite && (
                <Badge variant="secondary" className="mt-2">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  Favourite
                </Badge>
              )}
            </div>

            {client.contacts.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Contacts
                </h3>
                {client.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    {contactIcons[contact.type] || null}
                    <span className="capitalize text-muted-foreground">
                      {contact.type}:
                    </span>
                    <span>{contact.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-sm text-muted-foreground">
              <p>Added: {new Date(client.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Gallery */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Gallery ({client.gallery.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {client.gallery.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {client.gallery.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={clientGalleryImageUrl(client.id, item.fileName)}
                      alt="Client gallery"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No gallery images yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

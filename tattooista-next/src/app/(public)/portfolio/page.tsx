export const dynamic = "force-dynamic"

import { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse our tattoo portfolio showcasing various styles and designs.",
}

interface PortfolioPageProps {
  searchParams: Promise<{ style?: string }>
}

async function getPortfolioData(styleId?: string) {
  const styles = await prisma.tattooStyle.findMany({
    where: { isArchived: false },
    orderBy: { value: "asc" },
  })

  const galleryItems = await prisma.galleryItem.findMany({
    where: {
      isArchived: false,
      ...(styleId && {
        styles: {
          some: {
            tattooStyleId: styleId,
          },
        },
      }),
    },
    include: {
      styles: {
        include: {
          tattooStyle: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return { styles, galleryItems }
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const params = await searchParams
  const styleId = params.style
  const { styles, galleryItems } = await getPortfolioData(styleId)

  const activeStyle = styleId
    ? styles.find((s) => s.id === styleId)
    : null

  return (
    <div className="py-12 md:py-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of tattoo designs across various styles.
            Each piece is a unique work of art created for our clients.
          </p>
        </div>

        {/* Style Filters */}
        {styles.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Button
              variant={!styleId ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href="/portfolio">All Styles</Link>
            </Button>
            {styles
              .filter((style) => !style.nonStyle)
              .map((style) => (
                <Button
                  key={style.id}
                  variant={styleId === style.id ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link href={`/portfolio?style=${style.id}`}>{style.value}</Link>
                </Button>
              ))}
          </div>
        )}

        {/* Active Style Info */}
        {activeStyle && activeStyle.description && (
          <div className="max-w-2xl mx-auto text-center mb-12 p-6 bg-muted/50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{activeStyle.value}</h2>
            <p className="text-muted-foreground">{activeStyle.description}</p>
          </div>
        )}

        {/* Gallery Grid */}
        {galleryItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/gallery/${item.fileName}`}
                  alt="Tattoo artwork"
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay with styles */}
                {item.styles.length > 0 && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div className="flex flex-wrap gap-1">
                      {item.styles.map((s) => (
                        <Badge
                          key={s.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {s.tattooStyle.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {styleId
                ? "No tattoos found in this style yet."
                : "No tattoos in the portfolio yet."}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold mb-4">
            Like what you see?
          </h2>
          <p className="text-muted-foreground mb-6">
            Book a consultation to discuss your custom tattoo design.
          </p>
          <Button size="lg" asChild>
            <Link href="/#booking">Book Consultation</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

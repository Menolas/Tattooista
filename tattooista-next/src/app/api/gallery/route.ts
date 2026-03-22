import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const styleId = searchParams.get("styleId")
  const page = parseInt(searchParams.get("page") || "1", 10)
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10)

  const where = {
    isArchived: false,
    ...(styleId && {
      styles: {
        some: {
          tattooStyleId: styleId,
        },
      },
    }),
  }

  const [items, totalCount] = await Promise.all([
    prisma.galleryItem.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.galleryItem.count({ where }),
  ])

  return NextResponse.json({ gallery: items, totalCount })
}

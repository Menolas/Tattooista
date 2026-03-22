import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { auth } from "@/lib/auth"
import { requireTenantContext, requireStudioRole } from "@/lib/tenant"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const files = formData.getAll("files") as File[]
  const context = formData.get("context") as string | null // e.g. "gallery", "avatar", "wallpaper", "review", "client"

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 })
  }

  // Admin-only contexts require studio membership
  const adminContexts = ["gallery", "wallpaper", "client"]
  if (context && adminContexts.includes(context)) {
    try {
      const studio = await requireTenantContext()
      await requireStudioRole(session.user.id, studio.id)
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  // Review context requires activated user
  if (context === "review" && !session.user.isActivated) {
    return NextResponse.json({ error: "Please verify your email first" }, { status: 403 })
  }

  const uploaded: Array<{ url: string; name: string }> = []

  for (const file of files) {
    const blob = await put(`${context || "uploads"}/${file.name}`, file, {
      access: "public",
    })
    uploaded.push({ url: blob.url, name: file.name })
  }

  return NextResponse.json({ files: uploaded })
}

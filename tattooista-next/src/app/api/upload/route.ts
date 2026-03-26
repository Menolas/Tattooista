import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { requireSessionStudio, requireStudioRole } from "@/lib/tenant"
import path from "path"
import { writeFile, mkdir } from "fs/promises"

async function uploadFile(file: File, context: string): Promise<string> {
  // Production: use Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob")
    const blob = await put(`${context}/${file.name}`, file, { access: "public" })
    return blob.url
  }

  // Local dev: save to public/uploads/
  const uploadsDir = path.join(process.cwd(), "public", "uploads", context)
  await mkdir(uploadsDir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  const uniqueName = `${Date.now()}_${file.name}`
  const filePath = path.join(uploadsDir, uniqueName)
  await writeFile(filePath, buffer)

  return `/uploads/${context}/${uniqueName}`
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const files = formData.getAll("files") as File[]
  const context = formData.get("context") as string | null

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 })
  }

  // Admin-only contexts require studio membership
  const adminContexts = ["gallery", "wallpaper", "client", "studio"]
  if (context && adminContexts.includes(context)) {
    try {
      const studio = await requireSessionStudio()
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
    const url = await uploadFile(file, context || "uploads")
    uploaded.push({ url, name: file.name })
  }

  return NextResponse.json({ files: uploaded })
}

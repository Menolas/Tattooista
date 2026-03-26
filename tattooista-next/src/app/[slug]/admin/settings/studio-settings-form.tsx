"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateStudioSettings } from "@/lib/actions/studio"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { toast } from "sonner"
import { Upload, X } from "lucide-react"

interface StudioSettings {
  name: string
  slug: string
  logo: string | null
  heroImage: string | null
  heroPortrait: string | null
  heroTextLeft: string | null
  heroTextCenter: string | null
  heroTextBottom: string | null
  phone: string | null
  instagram: string | null
  facebook: string | null
}

function ImageUploadField({
  label,
  value,
  onChange,
  context,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  context: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("files", file)
      formData.append("context", context)

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Upload failed")
        return
      }

      onChange(data.files[0].url)
      toast.success("Image uploaded")
    } catch {
      toast.error("Upload failed")
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value && (
        <div className="relative w-32 h-32 border rounded overflow-hidden group">
          <Image src={value} alt={label} fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3 text-white" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <><LoadingSpinner size="sm" className="mr-2" />Uploading...</>
          ) : (
            <><Upload className="h-4 w-4 mr-2" />Upload</>
          )}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

export function StudioSettingsForm({ studio }: { studio: StudioSettings }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: studio.name,
    logo: studio.logo ?? "",
    heroImage: studio.heroImage ?? "",
    heroPortrait: studio.heroPortrait ?? "",
    heroTextLeft: studio.heroTextLeft ?? "",
    heroTextCenter: studio.heroTextCenter ?? "",
    heroTextBottom: studio.heroTextBottom ?? "",
    phone: studio.phone ?? "",
    instagram: studio.instagram ?? "",
    facebook: studio.facebook ?? "",
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    const result = await updateStudioSettings(form)
    setIsSubmitting(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Settings saved")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Studio name and branding.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Studio Name</Label>
            <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <ImageUploadField
            label="Logo"
            value={form.logo}
            onChange={(url) => update("logo", url)}
            context="studio"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>The main banner on your studio page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploadField
            label="Background Image"
            value={form.heroImage}
            onChange={(url) => update("heroImage", url)}
            context="studio"
          />
          <ImageUploadField
            label="Portrait / Illustration"
            value={form.heroPortrait}
            onChange={(url) => update("heroPortrait", url)}
            context="studio"
          />
          <div>
            <Label htmlFor="heroTextLeft">Side Label</Label>
            <Input id="heroTextLeft" value={form.heroTextLeft} onChange={(e) => update("heroTextLeft", e.target.value)} placeholder="Tattoo Artist" />
          </div>
          <div>
            <Label htmlFor="heroTextCenter">Main Heading (use new lines for multiple rows)</Label>
            <Textarea id="heroTextCenter" value={form.heroTextCenter} onChange={(e) => update("heroTextCenter", e.target.value)} placeholder={"Your\nStudio"} rows={2} />
          </div>
          <div>
            <Label htmlFor="heroTextBottom">Tagline</Label>
            <Input id="heroTextBottom" value={form.heroTextBottom} onChange={(e) => update("heroTextBottom", e.target.value)} placeholder="Your tagline goes here" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact & Social</CardTitle>
          <CardDescription>Phone number and social media links.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1234567890" />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input id="instagram" value={form.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="https://instagram.com/yourstudio" />
          </div>
          <div>
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input id="facebook" value={form.facebook} onChange={(e) => update("facebook", e.target.value)} placeholder="https://facebook.com/yourstudio" />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <><LoadingSpinner size="sm" className="mr-2" />Saving...</> : "Save Settings"}
      </Button>
    </form>
  )
}

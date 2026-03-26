"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Upload, X } from "lucide-react"
import { styleWallpaperUrl } from "@/lib/image-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { styleSchema, type StyleInput } from "@/lib/validations/style"
import { createStyle, updateStyle } from "@/lib/actions/styles"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

interface StyleFormProps {
  style?: {
    id: string
    value: string
    description: string | null
    wallPaper: string | null
    nonStyle: boolean
  }
  onSuccess?: () => void
}

export function StyleForm({ style, onSuccess }: StyleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    style?.wallPaper ? styleWallpaperUrl(style.id, style.wallPaper) : null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEditing = !!style

  const form = useForm<StyleInput>({
    resolver: zodResolver(styleSchema),
    defaultValues: {
      value: style?.value || "",
      description: style?.description || "",
      wallPaper: style?.wallPaper || "",
      nonStyle: style?.nonStyle || false,
    },
  })

  async function handleFileUpload(file: File) {
    setIsUploading(true)
    try {
      const uploadData = new FormData()
      uploadData.append("files", file)
      uploadData.append("context", "wallpaper")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const result = await response.json()
      const uploadedUrl = result.files[0].url

      form.setValue("wallPaper", uploadedUrl)
      setPreviewUrl(uploadedUrl)
      toast.success("Wallpaper uploaded!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  function handleRemoveWallpaper() {
    form.setValue("wallPaper", "")
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function onSubmit(data: StyleInput) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("value", data.value)
      if (data.description) formData.append("description", data.description)
      if (data.wallPaper) formData.append("wallPaper", data.wallPaper)
      formData.append("nonStyle", data.nonStyle ? "true" : "false")

      const result = isEditing
        ? await updateStyle(style.id, formData)
        : await createStyle(formData)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEditing ? "Style updated!" : "Style created!")
      onSuccess?.()
      router.refresh()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Traditional, Blackwork" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe this tattoo style..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wallPaper"
          render={() => (
            <FormItem>
              <FormLabel>Wallpaper Image</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  {previewUrl ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Style wallpaper preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveWallpaper}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-muted/30">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        {isUploading ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span className="text-sm">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8" />
                            <span className="text-sm">Click to upload wallpaper image</span>
                          </>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file)
                        }}
                      />
                    </label>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nonStyle"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Non-style category</FormLabel>
                <FormDescription>
                  Check if this is not a tattoo style (e.g., &quot;All Works&quot;)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Style"
          ) : (
            "Create Style"
          )}
        </Button>
      </form>
    </Form>
  )
}

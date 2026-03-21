"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallpaper Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
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

        <Button type="submit" disabled={isSubmitting}>
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

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { serviceSchema, type ServiceInput } from "@/lib/validations/service"
import { createService, updateService } from "@/lib/actions/services"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

interface ServiceFormProps {
  service?: {
    id: string
    title: string
    wallPaper: string | null
    conditions: string | null
    order: number
  }
  onSuccess?: () => void
}

export function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!service

  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: service?.title || "",
      wallPaper: service?.wallPaper || "",
      conditions: service?.conditions || "",
      order: service?.order || 0,
    },
  })

  async function onSubmit(data: ServiceInput) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", data.title)
      if (data.wallPaper) formData.append("wallPaper", data.wallPaper)
      if (data.conditions) formData.append("conditions", data.conditions)
      if (data.order !== undefined) formData.append("order", data.order.toString())

      const result = isEditing
        ? await updateService(service.id, formData)
        : await createService(formData)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEditing ? "Service updated!" : "Service created!")
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Title *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Custom Tattoos" {...field} />
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
          name="conditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conditions / Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the service conditions, pricing, etc..."
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
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                />
              </FormControl>
              <FormMessage />
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
            "Update Service"
          ) : (
            "Create Service"
          )}
        </Button>
      </form>
    </Form>
  )
}

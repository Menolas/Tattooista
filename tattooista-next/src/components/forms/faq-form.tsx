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
import { faqSchema, type FaqInput } from "@/lib/validations/faq"
import { createFaqItem, updateFaqItem } from "@/lib/actions/faq"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

interface FaqFormProps {
  faq?: {
    id: string
    question: string
    answer: string
    order: number
  }
  onSuccess?: () => void
}

export function FaqForm({ faq, onSuccess }: FaqFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!faq

  const form = useForm<FaqInput>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: faq?.question || "",
      answer: faq?.answer || "",
      order: faq?.order || 0,
    },
  })

  async function onSubmit(data: FaqInput) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("question", data.question)
      formData.append("answer", data.answer)
      if (data.order !== undefined) formData.append("order", data.order.toString())

      const result = isEditing
        ? await updateFaqItem(faq.id, formData)
        : await createFaqItem(formData)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEditing ? "FAQ updated!" : "FAQ created!")
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
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question *</FormLabel>
              <FormControl>
                <Input placeholder="Enter the question..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the answer..."
                  className="min-h-[150px]"
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
            "Update FAQ"
          ) : (
            "Create FAQ"
          )}
        </Button>
      </form>
    </Form>
  )
}

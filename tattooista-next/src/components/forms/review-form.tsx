"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { reviewSchema, type ReviewInput } from "@/lib/validations/review"
import { createReview, updateReview } from "@/lib/actions/reviews"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  review?: {
    id: string
    rate: number
    content: string
  }
  onSuccess?: () => void
}

export function ReviewForm({ review, onSuccess }: ReviewFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const isEditing = !!review

  const form = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rate: review?.rate || 5,
      content: review?.content || "",
    },
  })

  const currentRating = form.watch("rate")

  async function onSubmit(data: ReviewInput) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("rate", data.rate.toString())
      formData.append("content", data.content)

      const result = isEditing
        ? await updateReview(review.id, formData)
        : await createReview(formData)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEditing ? "Review updated!" : "Review submitted!")
      onSuccess?.()
      router.refresh()
      if (!isEditing) {
        form.reset()
      }
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
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 transition-transform hover:scale-110"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => field.onChange(star)}
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors",
                          (hoveredRating || currentRating) >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience..."
                  className="min-h-[150px]"
                  {...field}
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
              {isEditing ? "Updating..." : "Submitting..."}
            </>
          ) : isEditing ? (
            "Update Review"
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </Form>
  )
}

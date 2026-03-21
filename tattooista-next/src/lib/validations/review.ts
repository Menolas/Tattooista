import { z } from "zod"

export const reviewSchema = z.object({
  rate: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  content: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(2000, "Review is too long"),
  gallery: z.array(z.string().url()).optional(),
})

export const updateReviewSchema = reviewSchema.partial()

export type ReviewInput = z.infer<typeof reviewSchema>
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>

import { z } from "zod"

export const faqSchema = z.object({
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(500, "Question is too long"),
  answer: z
    .string()
    .min(10, "Answer must be at least 10 characters")
    .max(2000, "Answer is too long"),
  order: z.number().int().min(0).optional(),
})

export const updateFaqSchema = faqSchema.partial()

export type FaqInput = z.infer<typeof faqSchema>
export type UpdateFaqInput = z.infer<typeof updateFaqSchema>

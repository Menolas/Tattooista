import { z } from "zod"

export const serviceSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title is too long"),
  wallPaper: z.string().url().optional().or(z.literal("")),
  conditions: z.string().max(2000, "Conditions text is too long").optional(),
  order: z.number().int().min(0).optional(),
})

export const updateServiceSchema = serviceSchema.partial()

export type ServiceInput = z.infer<typeof serviceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>

import { z } from "zod"

export const pageSchema = z.object({
  name: z
    .string()
    .min(2, "Page name must be at least 2 characters")
    .max(50, "Page name is too long"),
  isActive: z.boolean().optional(),
  title: z.string().max(200, "Title is too long").optional(),
  wallPaper: z.string().url().optional().or(z.literal("")),
  content: z.string().max(10000, "Content is too long").optional(),
})

export const updatePageSchema = pageSchema.partial()

export type PageInput = z.infer<typeof pageSchema>
export type UpdatePageInput = z.infer<typeof updatePageSchema>

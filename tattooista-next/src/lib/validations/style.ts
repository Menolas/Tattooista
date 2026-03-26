import { z } from "zod"

export const styleSchema = z.object({
  value: z
    .string()
    .min(2, "Style name must be at least 2 characters")
    .max(50, "Style name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  wallPaper: z.string().optional().or(z.literal("")),
  nonStyle: z.boolean().optional(),
})

export const updateStyleSchema = styleSchema.partial()

export type StyleInput = z.infer<typeof styleSchema>
export type UpdateStyleInput = z.infer<typeof updateStyleSchema>

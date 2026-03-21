import { z } from "zod"

export const contactSchema = z.object({
  type: z.enum(["email", "phone", "instagram", "whatsapp", "messenger"]),
  value: z.string().min(1, "Contact value is required"),
})

export const clientSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  avatar: z.string().url().optional().or(z.literal("")),
  contacts: z.array(contactSchema).optional(),
})

export const updateClientSchema = clientSchema.partial()

export type ContactInput = z.infer<typeof contactSchema>
export type ClientInput = z.infer<typeof clientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>

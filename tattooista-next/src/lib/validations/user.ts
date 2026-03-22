import { z } from "zod"

export const createUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name is too long"),
})

export const updateUserSchema = z.object({
  email: z.string().email("Please enter a valid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long")
    .optional()
    .or(z.literal("")),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name is too long")
    .optional(),
  platformRole: z.enum(["USER", "PLATFORM_ADMIN"]).optional(),
  isActivated: z.boolean().optional(),
  avatar: z.string().url().optional().or(z.literal("")),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>

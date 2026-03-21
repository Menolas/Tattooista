import { z } from "zod"

export const bookingSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^[\d\s\-+()]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .regex(/^@?[\w.]+$/, "Please enter a valid Instagram handle")
    .optional()
    .or(z.literal("")),
  message: z.string().max(2000, "Message is too long").optional(),
})

export const updateBookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONTACTED", "COMPLETED", "CANCELLED"]),
})

export type BookingInput = z.infer<typeof bookingSchema>
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>

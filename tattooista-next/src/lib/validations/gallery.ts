import { z } from "zod"

export const galleryItemSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  styleIds: z.array(z.string()).optional(),
})

export const updateGalleryItemSchema = z.object({
  styleIds: z.array(z.string()).optional(),
})

export type GalleryItemInput = z.infer<typeof galleryItemSchema>
export type UpdateGalleryItemInput = z.infer<typeof updateGalleryItemSchema>

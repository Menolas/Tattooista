import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth, isAdmin } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  // Gallery images - admin only
  galleryUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user || !isAdmin(session.user.roles)) {
        throw new Error("Unauthorized")
      }
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Gallery upload complete for userId:", metadata.userId)
      console.log("File URL:", file.ufsUrl)
      return { uploadedBy: metadata.userId, url: file.ufsUrl }
    }),

  // User avatar - authenticated users
  avatarUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user) {
        throw new Error("Unauthorized")
      }
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar upload complete for userId:", metadata.userId)
      return { uploadedBy: metadata.userId, url: file.ufsUrl }
    }),

  // Client images - admin only
  clientUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user || !isAdmin(session.user.roles)) {
        throw new Error("Unauthorized")
      }
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Client image upload complete for userId:", metadata.userId)
      return { uploadedBy: metadata.userId, url: file.ufsUrl }
    }),

  // Review images - authenticated users
  reviewUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user) {
        throw new Error("Unauthorized")
      }
      if (!session.user.isActivated) {
        throw new Error("Please verify your email first")
      }
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Review image upload complete for userId:", metadata.userId)
      return { uploadedBy: metadata.userId, url: file.ufsUrl }
    }),

  // Wallpaper images (services, styles, pages) - admin only
  wallpaperUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user || !isAdmin(session.user.roles)) {
        throw new Error("Unauthorized")
      }
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Wallpaper upload complete for userId:", metadata.userId)
      return { uploadedBy: metadata.userId, url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

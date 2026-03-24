"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { requireSessionStudio, requireStudioRole } from "@/lib/tenant"
import { revalidatePath } from "next/cache"
import { reviewSchema, updateReviewSchema } from "@/lib/validations/review"

export async function getReviews(includeArchived = false) {
  const reviews = await prisma.review.findMany({
    where: includeArchived ? {} : { isArchived: false },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          avatar: true,
        },
      },
      gallery: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return reviews
}

export async function getReviewById(id: string) {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          avatar: true,
        },
      },
      gallery: true,
    },
  })

  if (!review) {
    throw new Error("Review not found")
  }

  return review
}

export async function getUserReviews(userId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      userId,
      isArchived: false,
    },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          avatar: true,
        },
      },
      gallery: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return reviews
}

export async function createReview(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    return { error: "You must be logged in to submit a review" }
  }

  if (!session.user.isActivated) {
    return { error: "Please verify your email before submitting a review" }
  }

  const studio = await requireSessionStudio()

  const galleryJson = formData.get("gallery")
  let gallery: string[] = []

  if (galleryJson && typeof galleryJson === "string") {
    try {
      gallery = JSON.parse(galleryJson)
    } catch {
      // Ignore invalid gallery data
    }
  }

  const rawData = {
    rate: parseInt(formData.get("rate") as string, 10),
    content: formData.get("content"),
    gallery,
  }

  const validationResult = reviewSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  const review = await prisma.review.create({
    data: {
      studioId: studio.id,
      rate: data.rate,
      content: data.content,
      userId: session.user.id,
      gallery: data.gallery && data.gallery.length > 0 ? {
        create: data.gallery.map((fileName) => ({
          studioId: studio.id,
          fileName,
        })),
      } : undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          avatar: true,
        },
      },
      gallery: true,
    },
  })

  revalidatePath("/reviews")
  return { success: true, data: review }
}

export async function updateReview(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const review = await prisma.review.findUnique({
    where: { id },
  })

  if (!review) {
    return { error: "Review not found" }
  }

  // Only the author can update their review
  if (review.userId !== session.user.id) {
    return { error: "You can only edit your own reviews" }
  }

  const rawData = {
    rate: formData.has("rate") ? parseInt(formData.get("rate") as string, 10) : undefined,
    content: formData.get("content") || undefined,
  }

  const validationResult = updateReviewSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  const updatedReview = await prisma.review.update({
    where: { id },
    data: {
      ...(data.rate !== undefined && { rate: data.rate }),
      ...(data.content && { content: data.content }),
    },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          avatar: true,
        },
      },
      gallery: true,
    },
  })

  revalidatePath("/reviews")
  return { success: true, data: updatedReview }
}

export async function addReviewGalleryItem(reviewId: string, fileName: string) {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const studio = await requireSessionStudio()

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  })

  if (!review) {
    return { error: "Review not found" }
  }

  if (review.userId !== session.user.id) {
    return { error: "You can only edit your own reviews" }
  }

  await prisma.reviewGalleryItem.create({
    data: {
      studioId: studio.id,
      fileName,
      reviewId,
    },
  })

  revalidatePath("/reviews")
  return { success: true }
}

export async function removeReviewGalleryItem(id: string) {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const item = await prisma.reviewGalleryItem.findUnique({
    where: { id },
    include: {
      review: true,
    },
  })

  if (!item) {
    return { error: "Gallery item not found" }
  }

  if (item.review.userId !== session.user.id) {
    return { error: "You can only edit your own reviews" }
  }

  await prisma.reviewGalleryItem.delete({
    where: { id },
  })

  revalidatePath("/reviews")
  return { success: true }
}

export async function archiveReview(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.review.update({
    where: { id },
    data: { isArchived: true },
  })

  revalidatePath("/reviews")
  revalidatePath("/[slug]/admin/reviews", "page")
  return { success: true }
}

export async function restoreReview(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.review.update({
    where: { id },
    data: { isArchived: false },
  })

  revalidatePath("/reviews")
  revalidatePath("/[slug]/admin/reviews", "page")
  return { success: true }
}

export async function deleteReview(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.review.delete({
    where: { id },
  })

  revalidatePath("/reviews")
  revalidatePath("/[slug]/admin/reviews", "page")
  return { success: true }
}

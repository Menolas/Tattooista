import { prisma } from "./prisma"
import { validateSlug } from "./slug"

interface StudioCreationInput {
  name: string
  slug: string
  logo?: string
}

type StudioValidation =
  | { valid: true }
  | { valid: false; reason: string }

export function validateStudioCreation(
  input: Pick<StudioCreationInput, "name" | "slug">
): StudioValidation {
  if (!input.name || !input.name.trim()) {
    return { valid: false, reason: "Studio name is required" }
  }

  const slugValidation = validateSlug(input.slug)
  if (!slugValidation.valid) {
    return slugValidation
  }

  return { valid: true }
}

export async function createStudioWithDefaults(
  ownerId: string,
  input: StudioCreationInput
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.studio.findUnique({
      where: { slug: input.slug },
    })
    if (existing) {
      throw new Error(`Slug "${input.slug}" is already taken`)
    }

    const studio = await tx.studio.create({
      data: {
        name: input.name.trim(),
        slug: input.slug,
        logo: input.logo ?? null,
      },
    })

    await tx.studioMembership.create({
      data: {
        userId: ownerId,
        studioId: studio.id,
        role: "OWNER",
      },
    })

    await tx.page.createMany({
      data: [
        { studioId: studio.id, name: "about", isActive: true },
        { studioId: studio.id, name: "contacts", isActive: true },
      ],
    })

    await tx.tattooStyle.create({
      data: {
        studioId: studio.id,
        value: "Other",
        nonStyle: true,
      },
    })

    return studio
  })
}

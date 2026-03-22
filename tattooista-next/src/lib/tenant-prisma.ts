import { prisma } from "./prisma"

export const TENANT_SCOPED_MODELS = [
  "client", "contact", "clientGalleryItem",
  "booking", "review", "reviewGalleryItem",
  "galleryItem", "galleryItemStyle", "tattooStyle",
  "service", "page", "faqItem",
] as const

export type TenantScopedModel = (typeof TENANT_SCOPED_MODELS)[number]

export function isTenantScopedModel(model: string): model is TenantScopedModel {
  return (TENANT_SCOPED_MODELS as readonly string[]).includes(model)
}

function toModelName(model: string): string {
  return model.charAt(0).toLowerCase() + model.slice(1)
}

export function tenantPrisma(studioId: string) {
  if (!studioId) {
    throw new Error("tenantPrisma requires a studioId")
  }

  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (isTenantScopedModel(toModelName(model))) {
            args.where = { ...args.where, studioId }
          }
          return query(args)
        },
        async findFirst({ model, args, query }) {
          if (isTenantScopedModel(toModelName(model))) {
            args.where = { ...args.where, studioId }
          }
          return query(args)
        },
        async findUnique({ model, args, query }) {
          const modelName = toModelName(model)
          if (isTenantScopedModel(modelName)) {
            const result = await query(args)
            if (result && (result as any).studioId !== studioId) {
              return null
            }
            return result
          }
          return query(args)
        },
        async create({ model, args, query }) {
          if (isTenantScopedModel(toModelName(model))) {
            args.data = { ...args.data, studioId }
          }
          return query(args)
        },
        async createMany({ model, args, query }) {
          if (isTenantScopedModel(toModelName(model))) {
            if (Array.isArray(args.data)) {
              args.data = args.data.map((d: any) => ({ ...d, studioId }))
            } else {
              args.data = { ...args.data, studioId }
            }
          }
          return query(args)
        },
        async update({ model, args, query }) {
          if (isTenantScopedModel(toModelName(model))) {
            args.where = { ...args.where, studioId } as any
          }
          return query(args)
        },
        async updateMany({ model, args, query }) {
          if (isTenantScopedModel(toModelName(model))) {
            args.where = { ...args.where, studioId }
          }
          return query(args)
        },
        async delete({ model, args, query }) {
          if (isTenantScopedModel(toModelName(model))) {
            args.where = { ...args.where, studioId } as any
          }
          return query(args)
        },
        async deleteMany({ model, args, query }) {
          if (isTenantScopedModel(toModelName(model))) {
            args.where = { ...args.where, studioId }
          }
          return query(args)
        },
      },
    },
  })
}

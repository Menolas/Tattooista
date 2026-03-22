import { headers } from "next/headers"
import { prisma } from "./prisma"
import type { Studio, StudioRole } from "@/types"

const SPECIAL_SUBDOMAINS = ["www", "app"]

// Domains where the first segment is NOT a tenant subdomain
const PLATFORM_DOMAINS = ["vercel.app", "vercel.sh"]

export function extractSubdomain(hostname: string): string | null {
  const host = hostname.split(":")[0]

  if (host === "localhost" || host === "127.0.0.1") {
    return null
  }

  // Skip subdomain extraction on Vercel preview/deployment URLs
  for (const domain of PLATFORM_DOMAINS) {
    if (host.endsWith(`.${domain}`)) {
      return null
    }
  }

  const parts = host.split(".")

  if (parts.length <= 2) {
    return null
  }

  const subdomain = parts[0]

  if (SPECIAL_SUBDOMAINS.includes(subdomain)) {
    return null
  }

  return subdomain
}

export const STUDIO_ID_HEADER = "x-studio-id"

export async function getTenantContext(): Promise<Studio | null> {
  const headersList = await headers()
  const studioId = headersList.get(STUDIO_ID_HEADER)

  if (!studioId) return null

  const studio = await prisma.studio.findUnique({
    where: { id: studioId },
  })

  return studio as Studio | null
}

export async function requireTenantContext(): Promise<Studio> {
  const studio = await getTenantContext()
  if (!studio) {
    throw new Error("This page requires a studio context")
  }
  return studio
}

export async function requireStudioRole(
  userId: string,
  studioId: string,
  requiredRole?: StudioRole
): Promise<StudioRole> {
  const membership = await prisma.studioMembership.findUnique({
    where: {
      userId_studioId: { userId, studioId },
    },
  })

  if (!membership) {
    throw new Error("You are not a member of this studio")
  }

  if (requiredRole && requiredRole === "OWNER" && membership.role !== "OWNER") {
    throw new Error("Only studio owners can perform this action")
  }

  return membership.role as StudioRole
}

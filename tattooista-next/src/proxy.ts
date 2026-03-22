import NextAuth from "next-auth"
import authConfig from "@/lib/auth.config"
import { NextResponse } from "next/server"
import { extractSubdomain, STUDIO_ID_HEADER } from "@/lib/tenant"
import { prisma } from "@/lib/prisma"

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  // ---- SECURITY: Strip any client-sent x-studio-id header ----
  const requestHeaders = new Headers(req.headers)
  requestHeaders.delete(STUDIO_ID_HEADER)

  // ---- TENANT RESOLUTION ----
  const hostname = req.headers.get("host") || "localhost:3000"

  // Resolve tenant: subdomain takes priority, ?studio=slug as fallback
  const slug = extractSubdomain(hostname) || nextUrl.searchParams.get("studio")

  // If we have a slug, resolve the studio
  if (slug) {
    try {
      const studio = await prisma.studio.findUnique({
        where: { slug },
        select: { id: true, isActive: true },
      })

      if (!studio) {
        return NextResponse.rewrite(new URL("/not-found", nextUrl))
      }

      if (!studio.isActive) {
        return NextResponse.rewrite(new URL("/studio-suspended", nextUrl))
      }

      // Inject studioId for downstream use
      requestHeaders.set(STUDIO_ID_HEADER, studio.id)
    } catch (error) {
      console.error("Proxy: tenant resolution failed", error)
      return NextResponse.next({ request: { headers: requestHeaders } })
    }
  }

  // ---- ROUTE PROTECTION ----
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register")
  const isPublicRoute =
    nextUrl.pathname === "/" ||
    nextUrl.pathname.startsWith("/portfolio") ||
    nextUrl.pathname.startsWith("/reviews") ||
    nextUrl.pathname.startsWith("/contacts") ||
    nextUrl.pathname.startsWith("/api/auth") ||
    nextUrl.pathname.startsWith("/verify-email") ||
    nextUrl.pathname.startsWith("/reset-password")

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  // Protect admin routes — require login
  // (full role check happens in the admin layout)
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
  }

  // Require login for non-public routes
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}

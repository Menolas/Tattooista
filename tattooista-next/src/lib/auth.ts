import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import authConfig from "./auth.config"
import type { Role } from "@/types"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      displayName: string
      avatar: string | null
      roles: Role[]
      isActivated: boolean
    }
  }

  interface User {
    id: string
    email: string
    displayName: string
    avatar: string | null
    roles: Role[]
    isActivated: boolean
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    roles: Role[]
    isActivated: boolean
    displayName: string
    avatar: string | null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        })

        if (!user) {
          throw new Error("Invalid email or password")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        if (!user.isActivated) {
          throw new Error("Please verify your email before logging in")
        }

        const roles = user.roles.map((ur) => ur.role.value as Role)

        return {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar,
          roles,
          isActivated: user.isActivated,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.roles = user.roles
        token.isActivated = user.isActivated
        token.displayName = user.displayName
        token.avatar = user.avatar
      }

      // Handle session update (e.g., after profile update)
      if (trigger === "update" && session) {
        token.displayName = session.displayName ?? token.displayName
        token.avatar = session.avatar ?? token.avatar
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.roles = token.roles as Role[]
        session.user.isActivated = token.isActivated as boolean
        session.user.displayName = token.displayName as string
        session.user.avatar = token.avatar as string | null
      }
      return session
    },
  },
})

// Helper functions for role checking
export function hasRole(roles: Role[], requiredRole: Role): boolean {
  return roles.includes(requiredRole)
}

export function isAdmin(roles: Role[]): boolean {
  return hasRole(roles, "ADMIN") || hasRole(roles, "SUPERADMIN")
}

export function isSuperAdmin(roles: Role[]): boolean {
  return hasRole(roles, "SUPERADMIN")
}

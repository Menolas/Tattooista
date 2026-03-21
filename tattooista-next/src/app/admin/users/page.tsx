export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth, isSuperAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UsersManager } from "./users-manager"
import type { Role } from "@/types"

export const metadata: Metadata = {
  title: "User Management",
}

async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return users.map((user) => ({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatar: user.avatar,
    isActivated: user.isActivated,
    roles: user.roles.map((ur) => ur.role.value as Role),
    createdAt: user.createdAt,
  }))
}

export default async function UsersPage() {
  const session = await auth()

  if (!session?.user || !isSuperAdmin(session.user.roles)) {
    redirect("/admin")
  }

  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts and permissions.
        </p>
      </div>

      <UsersManager users={users} currentUserId={session.user.id} />
    </div>
  )
}

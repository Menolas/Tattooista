"use server"

import { prisma } from "@/lib/prisma"
import { auth, isSuperAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { createUserSchema, updateUserSchema } from "@/lib/validations/user"
import { updateProfileSchema } from "@/lib/validations/auth"
import bcrypt from "bcryptjs"
import type { Role } from "@/types"

export async function getUsers() {
  const session = await auth()
  if (!session?.user || !isSuperAdmin(session.user.roles)) {
    throw new Error("Unauthorized")
  }

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
    updatedAt: user.updatedAt,
  }))
}

export async function getUserById(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  // Users can view their own profile, superadmins can view any profile
  if (session.user.id !== id && !isSuperAdmin(session.user.roles)) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatar: user.avatar,
    isActivated: user.isActivated,
    roles: user.roles.map((ur) => ur.role.value as Role),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export async function createUser(formData: FormData) {
  const session = await auth()
  if (!session?.user || !isSuperAdmin(session.user.roles)) {
    return { error: "Unauthorized" }
  }

  const rolesJson = formData.get("roles")
  let roles: Role[] = ["USER"]

  if (rolesJson && typeof rolesJson === "string") {
    try {
      roles = JSON.parse(rolesJson)
    } catch {
      return { error: "Invalid roles data" }
    }
  }

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
    roles,
  }

  const validationResult = createUserSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  // Check if user exists
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existing) {
    return { error: "A user with this email already exists" }
  }

  const hashedPassword = await bcrypt.hash(data.password, 12)

  // Get or create roles
  const roleRecords = await Promise.all(
    data.roles.map(async (roleValue) => {
      let role = await prisma.role.findUnique({
        where: { value: roleValue },
      })
      if (!role) {
        role = await prisma.role.create({
          data: { value: roleValue },
        })
      }
      return role
    })
  )

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      displayName: data.displayName,
      isActivated: true, // Admin-created users are pre-activated
      roles: {
        create: roleRecords.map((role) => ({
          roleId: role.id,
        })),
      },
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  })

  revalidatePath("/admin/users")
  return {
    success: true,
    data: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      roles: user.roles.map((ur) => ur.role.value as Role),
    },
  }
}

export async function updateUser(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user || !isSuperAdmin(session.user.roles)) {
    return { error: "Unauthorized" }
  }

  const rolesJson = formData.get("roles")
  let roles: Role[] | undefined

  if (rolesJson && typeof rolesJson === "string") {
    try {
      roles = JSON.parse(rolesJson)
    } catch {
      return { error: "Invalid roles data" }
    }
  }

  const rawData = {
    email: formData.get("email") || undefined,
    password: formData.get("password") || undefined,
    displayName: formData.get("displayName") || undefined,
    isActivated: formData.has("isActivated") ? formData.get("isActivated") === "true" : undefined,
    avatar: formData.get("avatar") || undefined,
    roles,
  }

  const validationResult = updateUserSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  // Check if another user has this email
  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: { id },
      },
    })

    if (existing) {
      return { error: "A user with this email already exists" }
    }
  }

  // Update roles if provided
  if (data.roles) {
    // Delete existing roles
    await prisma.userRole.deleteMany({
      where: { userId: id },
    })

    // Get or create roles and assign
    const roleRecords = await Promise.all(
      data.roles.map(async (roleValue) => {
        let role = await prisma.role.findUnique({
          where: { value: roleValue },
        })
        if (!role) {
          role = await prisma.role.create({
            data: { value: roleValue },
          })
        }
        return role
      })
    )

    await prisma.userRole.createMany({
      data: roleRecords.map((role) => ({
        userId: id,
        roleId: role.id,
      })),
    })
  }

  const updateData: Record<string, unknown> = {}
  if (data.email) updateData.email = data.email
  if (data.displayName) updateData.displayName = data.displayName
  if (data.isActivated !== undefined) updateData.isActivated = data.isActivated
  if (data.avatar !== undefined) updateData.avatar = data.avatar || null
  if (data.password) updateData.password = await bcrypt.hash(data.password, 12)

  await prisma.user.update({
    where: { id },
    data: updateData,
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function deleteUser(id: string) {
  const session = await auth()
  if (!session?.user || !isSuperAdmin(session.user.roles)) {
    return { error: "Unauthorized" }
  }

  // Prevent self-deletion
  if (session.user.id === id) {
    return { error: "You cannot delete your own account" }
  }

  await prisma.user.delete({
    where: { id },
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  const rawData = {
    displayName: formData.get("displayName"),
    avatar: formData.get("avatar") || "",
  }

  const validationResult = updateProfileSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      displayName: data.displayName,
      avatar: data.avatar || null,
    },
  })

  revalidatePath("/admin/profile")
  return { success: true }
}

export async function getRoles() {
  const roles = await prisma.role.findMany({
    orderBy: { value: "asc" },
  })

  return roles.map((role) => role.value as Role)
}

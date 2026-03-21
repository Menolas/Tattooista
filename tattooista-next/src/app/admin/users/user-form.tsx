"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createUserSchema, updateUserSchema } from "@/lib/validations/user"
import { createUser, updateUser } from "@/lib/actions/users"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import type { Role } from "@/types"
import { z } from "zod"

const roles: Role[] = ["USER", "ADMIN", "SUPERADMIN"]

interface UserFormProps {
  user?: {
    id: string
    email: string
    displayName: string
    avatar: string | null
    isActivated: boolean
    roles: Role[]
  }
  onSuccess?: () => void
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!user

  const schema = isEditing ? updateUserSchema : createUserSchema

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email || "",
      password: "",
      displayName: user?.displayName || "",
      roles: user?.roles || ["USER"],
      ...(isEditing && {
        isActivated: user?.isActivated,
        avatar: user?.avatar || "",
      }),
    },
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("email", data.email || "")
      if (data.password) formData.append("password", data.password)
      formData.append("displayName", data.displayName || "")
      formData.append("roles", JSON.stringify(data.roles))

      if (isEditing) {
        if ("isActivated" in data && data.isActivated !== undefined) {
          formData.append("isActivated", data.isActivated.toString())
        }
        if ("avatar" in data && data.avatar) {
          formData.append("avatar", data.avatar)
        }
      }

      const result = isEditing
        ? await updateUser(user.id, formData)
        : await createUser(formData)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEditing ? "User updated!" : "User created!")
      onSuccess?.()
      router.refresh()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name {!isEditing && "*"}</FormLabel>
              <FormControl>
                <Input placeholder="User name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email {!isEditing && "*"}</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password {!isEditing && "*"}
                {isEditing && " (leave empty to keep current)"}
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roles"
          render={() => (
            <FormItem>
              <FormLabel>Roles *</FormLabel>
              <div className="space-y-2">
                {roles.map((role) => (
                  <FormField
                    key={role}
                    control={form.control}
                    name="roles"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(role)}
                            onCheckedChange={(checked) => {
                              const current = field.value || []
                              if (checked) {
                                field.onChange([...current, role])
                              } else {
                                field.onChange(
                                  current.filter((r: Role) => r !== role)
                                )
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{role}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <FormField
            control={form.control}
            name="isActivated"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Account Activated</FormLabel>
                  <FormDescription>
                    User can log in when activated
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update User"
          ) : (
            "Create User"
          )}
        </Button>
      </form>
    </Form>
  )
}

"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations/auth"
import { updateProfile } from "@/lib/actions/users"
import { LoadingSpinner, PageLoader } from "@/components/shared/loading-spinner"
import { userAvatarUrl } from "@/lib/image-utils"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: session?.user?.displayName || "",
      avatar: session?.user?.avatar || "",
    },
  })

  if (!session?.user) {
    return <PageLoader />
  }

  async function onSubmit(data: UpdateProfileInput) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("displayName", data.displayName)
      if (data.avatar) formData.append("avatar", data.avatar)

      const result = await updateProfile(formData)

      if (result.error) {
        toast.error(result.error)
        return
      }

      // Update session with new data
      await update({
        displayName: data.displayName,
        avatar: data.avatar || null,
      })

      toast.success("Profile updated!")
      router.refresh()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account profile information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={session.user.avatar ? userAvatarUrl(session.user.id, session.user.avatar) : undefined}
                alt={session.user.displayName}
              />
              <AvatarFallback className="text-2xl">
                {session.user.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-lg">{session.user.displayName}</p>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>
            Your account information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{session.user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <p>{session.user.platformRole}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Account Status
            </p>
            <p>{session.user.isActivated ? "Active" : "Pending Verification"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { clientSchema, type ClientInput } from "@/lib/validations/client"
import { createClient, updateClient } from "@/lib/actions/clients"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { Plus, Trash2 } from "lucide-react"

const contactTypes = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "instagram", label: "Instagram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "messenger", label: "Messenger" },
]

interface ClientFormProps {
  client?: {
    id: string
    fullName: string
    avatar: string | null
    contacts: Array<{ type: string; value: string }>
  }
  onSuccess?: () => void
}

export function ClientForm({ client, onSuccess }: ClientFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!client

  const form = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      fullName: client?.fullName || "",
      avatar: client?.avatar || "",
      contacts: client?.contacts?.map((c) => ({
        type: c.type as "email" | "phone" | "instagram" | "whatsapp" | "messenger",
        value: c.value,
      })) || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contacts",
  })

  async function onSubmit(data: ClientInput) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("fullName", data.fullName)
      if (data.avatar) formData.append("avatar", data.avatar)
      if (data.contacts && data.contacts.length > 0) {
        formData.append("contacts", JSON.stringify(data.contacts))
      }

      const result = isEditing
        ? await updateClient(client.id, formData)
        : await createClient(formData)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEditing ? "Client updated!" : "Client created!")
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
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input placeholder="Client name" {...field} />
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Contacts</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ type: "phone", value: "" })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Contact
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={form.control}
                name={`contacts.${index}.type`}
                render={({ field }) => (
                  <FormItem className="w-[140px]">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contactTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`contacts.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Contact value" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : isEditing ? (
              "Update Client"
            ) : (
              "Create Client"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

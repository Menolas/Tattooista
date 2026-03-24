"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Edit } from "lucide-react"
import { updatePageSchema, type UpdatePageInput } from "@/lib/validations/page"
import { updatePage } from "@/lib/actions/pages"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import type { Page } from "@prisma/client"

interface PagesManagerProps {
  pages: Page[]
}

export function PagesManager({ pages }: PagesManagerProps) {
  const [editingPage, setEditingPage] = useState<Page | null>(null)

  return (
    <>
      {pages.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No pages found.</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium capitalize">
                    {page.name}
                  </TableCell>
                  <TableCell>{page.title || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={page.isActive ? "default" : "secondary"}>
                      {page.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingPage(page)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingPage} onOpenChange={() => setEditingPage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Page: {editingPage?.name}</DialogTitle>
            <DialogDescription>
              Update page content and settings.
            </DialogDescription>
          </DialogHeader>
          {editingPage && (
            <PageEditForm
              page={editingPage}
              onSuccess={() => setEditingPage(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

interface PageEditFormProps {
  page: Page
  onSuccess: () => void
}

function PageEditForm({ page, onSuccess }: PageEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UpdatePageInput>({
    resolver: zodResolver(updatePageSchema),
    defaultValues: {
      title: page.title || "",
      wallPaper: page.wallPaper || "",
      content: page.content || "",
      isActive: page.isActive,
    },
  })

  async function onSubmit(data: UpdatePageInput) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      if (data.title !== undefined) formData.append("title", data.title || "")
      if (data.wallPaper !== undefined) formData.append("wallPaper", data.wallPaper || "")
      if (data.content !== undefined) formData.append("content", data.content || "")
      if (data.isActive !== undefined)
        formData.append("isActive", data.isActive.toString())

      const result = await updatePage(page.id, formData)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success("Page updated!")
      onSuccess()
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Page title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wallPaper"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallpaper Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Page content..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
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
        </div>
      </form>
    </Form>
  )
}

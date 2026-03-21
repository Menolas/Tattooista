"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StyleForm } from "@/components/forms/style-form"
import { MoreHorizontal, Edit, Archive, Trash2, Plus } from "lucide-react"
import { archiveStyle, deleteStyle } from "@/lib/actions/styles"
import type { TattooStyle } from "@prisma/client"

interface StyleWithCount extends TattooStyle {
  galleryCount: number
}

interface StylesManagerProps {
  styles: StyleWithCount[]
}

export function StylesManager({ styles }: StylesManagerProps) {
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingStyle, setEditingStyle] = useState<StyleWithCount | null>(null)

  const handleArchive = async (id: string) => {
    const result = await archiveStyle(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Style archived")
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this style?")) return

    const result = await deleteStyle(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Style deleted")
      router.refresh()
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Style
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Style</DialogTitle>
              <DialogDescription>
                Create a new tattoo style category.
              </DialogDescription>
            </DialogHeader>
            <StyleForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {styles.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No styles yet.</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Style Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Gallery Items</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {styles.map((style) => (
                <TableRow key={style.id}>
                  <TableCell className="font-medium">{style.value}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {style.description || "-"}
                  </TableCell>
                  <TableCell>{style.galleryCount}</TableCell>
                  <TableCell>
                    {style.nonStyle ? (
                      <Badge variant="secondary">Non-style</Badge>
                    ) : (
                      <Badge>Style</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingStyle(style)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleArchive(style.id)}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(style.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingStyle} onOpenChange={() => setEditingStyle(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Style</DialogTitle>
            <DialogDescription>
              Update style information.
            </DialogDescription>
          </DialogHeader>
          {editingStyle && (
            <StyleForm
              style={editingStyle}
              onSuccess={() => setEditingStyle(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

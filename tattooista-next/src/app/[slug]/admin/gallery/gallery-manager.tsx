"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  createManyGalleryItems,
  updateGalleryItemStyles,
  archiveGalleryItem,
  deleteGalleryItem,
} from "@/lib/actions/gallery"
import { Upload, MoreVertical, Archive, Trash2, Tag, X, ImagePlus } from "lucide-react"
import { galleryImageUrl } from "@/lib/image-utils"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import type { TattooStyle } from "@prisma/client"

interface GalleryItem {
  id: string
  fileName: string
  isArchived: boolean
  styles: TattooStyle[]
  createdAt: Date
}

interface GalleryManagerProps {
  galleryItems: GalleryItem[]
  styles: TattooStyle[]
}

interface FilePreview {
  file: File
  previewUrl: string
}

export function GalleryManager({ galleryItems, styles }: GalleryManagerProps) {
  const router = useRouter()
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedStyleIds, setSelectedStyleIds] = useState<string[]>([])
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Reset input so the same files can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = ""

    const totalFiles = files.length
    const newPreviews: FilePreview[] = []
    for (const file of files) {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push({ file, previewUrl: reader.result as string })
        if (newPreviews.length === totalFiles) {
          setFilePreviews((prev) => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePreview = (fileToRemove: File) => {
    setFilePreviews((prev) => prev.filter(({ file }) => file !== fileToRemove))
  }

  const handleUploadSubmit = async () => {
    if (filePreviews.length === 0) return
    if (selectedStyleIds.length === 0) {
      toast.error("Please select at least one style")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      for (const { file } of filePreviews) {
        formData.append("files", file)
      }
      formData.append("context", "gallery")

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Upload failed")
        return
      }

      const items = data.files.map((file: { url: string }) => ({
        fileName: file.url,
        styleIds: selectedStyleIds,
      }))

      const result = await createManyGalleryItems(items)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`${data.files.length} image(s) uploaded successfully`)
        setIsUploadDialogOpen(false)
        setSelectedStyleIds([])
        setFilePreviews([])
        router.refresh()
      }
    } catch {
      toast.error("Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDialogClose = (open: boolean) => {
    setIsUploadDialogOpen(open)
    if (!open) {
      setFilePreviews([])
      setSelectedStyleIds([])
    }
  }

  const handleStyleUpdate = async (itemId: string, styleIds: string[]) => {
    const result = await updateGalleryItemStyles(itemId, styleIds)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Styles updated")
      setEditingItem(null)
      router.refresh()
    }
  }

  const handleArchive = async (id: string) => {
    const result = await archiveGalleryItem(id)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Image archived")
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    const result = await deleteGalleryItem(id)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Image deleted")
      router.refresh()
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isUploadDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Images
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload Gallery Images</DialogTitle>
              <DialogDescription>
                Select images, choose styles, then upload.
              </DialogDescription>
            </DialogHeader>

            {/* Image Previews */}
            {filePreviews.length > 0 && (
              <div className="space-y-2">
                <Label>Selected images ({filePreviews.length}):</Label>
                <div className="grid grid-cols-3 gap-2">
                  {filePreviews.map(({ file, previewUrl }) => (
                    <div key={file.name + file.lastModified} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePreview(file)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pick Files Button */}
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                <ImagePlus className="h-4 w-4" />
                {filePreviews.length > 0 ? "Add More Images" : "Pick Files"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFilesSelected}
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* Style Selection */}
            {styles.length > 0 && (
              <div className="space-y-3">
                <Label>Select styles for uploaded images: *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {styles
                    .filter((style) => !style.nonStyle)
                    .map((style) => (
                      <div key={style.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`upload-style-${style.id}`}
                          checked={selectedStyleIds.includes(style.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStyleIds([...selectedStyleIds, style.id])
                            } else {
                              setSelectedStyleIds(
                                selectedStyleIds.filter((id) => id !== style.id)
                              )
                            }
                          }}
                        />
                        <Label
                          htmlFor={`upload-style-${style.id}`}
                          className="text-sm font-normal"
                        >
                          {style.value}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              onClick={handleUploadSubmit}
              disabled={isUploading || filePreviews.length === 0 || selectedStyleIds.length === 0}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Uploading...
                </>
              ) : (
                `Upload ${filePreviews.length} Image${filePreviews.length !== 1 ? "s" : ""}`
              )}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Grid */}
      {galleryItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={galleryImageUrl(item.fileName)}
                alt="Gallery item"
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Actions */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingItem(item)}>
                        <Tag className="mr-2 h-4 w-4" />
                        Edit Styles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchive(item.id)}>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Style Badges */}
                {item.styles.length > 0 && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex flex-wrap gap-1">
                      {item.styles.map((style) => (
                        <Badge
                          key={style.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {style.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No gallery images yet.</p>
        </div>
      )}

      {/* Edit Styles Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Styles</DialogTitle>
            <DialogDescription>
              Select styles for this gallery item.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <EditStylesForm
              item={editingItem}
              styles={styles}
              onSave={handleStyleUpdate}
              onCancel={() => setEditingItem(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

interface EditStylesFormProps {
  item: GalleryItem
  styles: TattooStyle[]
  onSave: (itemId: string, styleIds: string[]) => void
  onCancel: () => void
}

function EditStylesForm({ item, styles, onSave, onCancel }: EditStylesFormProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    item.styles.map((s) => s.id)
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {styles
          .filter((style) => !style.nonStyle)
          .map((style) => (
            <div key={style.id} className="flex items-center gap-2">
              <Checkbox
                id={`edit-style-${style.id}`}
                checked={selectedIds.includes(style.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedIds([...selectedIds, style.id])
                  } else {
                    setSelectedIds(selectedIds.filter((id) => id !== style.id))
                  }
                }}
              />
              <Label
                htmlFor={`edit-style-${style.id}`}
                className="text-sm font-normal"
              >
                {style.value}
              </Label>
            </div>
          ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(item.id, selectedIds)}>Save</Button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteStudio } from "@/lib/actions/studio"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

export function DeleteStudioButton() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setIsDeleting(true)
    setError(null)
    const result = await deleteStudio()
    if (result.error) {
      setError(result.error)
      setIsDeleting(false)
      return
    }
    window.location.href = "/"
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Studio</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your studio, all clients, bookings,
              gallery items, styles, services, FAQ, and pages. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <><LoadingSpinner size="sm" className="mr-2" />Deleting...</>
              ) : "Yes, delete everything"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    </div>
  )
}

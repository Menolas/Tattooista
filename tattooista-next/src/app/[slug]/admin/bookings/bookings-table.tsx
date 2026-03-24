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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreHorizontal, Eye, UserPlus, Archive, Trash2 } from "lucide-react"
import {
  updateBookingStatus,
  archiveBooking,
  deleteBooking,
  convertBookingToClient,
} from "@/lib/actions/bookings"
import type { Booking, BookingStatus } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"

const statusColors: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  CONTACTED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  COMPLETED: "bg-green-100 text-green-800 hover:bg-green-100",
  CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100",
}

interface BookingsTableProps {
  bookings: Booking[]
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const router = useRouter()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    const result = await updateBookingStatus(id, status)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Status updated")
      router.refresh()
    }
  }

  const handleArchive = async (id: string) => {
    const result = await archiveBooking(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Booking archived")
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return

    const result = await deleteBooking(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Booking deleted")
      router.refresh()
    }
  }

  const handleConvertToClient = async (id: string) => {
    const result = await convertBookingToClient(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Booking converted to client")
      router.refresh()
    }
  }

  const viewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsViewDialogOpen(true)
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No bookings yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.fullName}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {booking.email && <div>{booking.email}</div>}
                    {booking.phone && <div>{booking.phone}</div>}
                    {booking.instagram && <div>{booking.instagram}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${statusColors[booking.status]} cursor-pointer`}
                      >
                        {booking.status}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(["PENDING", "CONTACTED", "COMPLETED", "CANCELLED"] as BookingStatus[]).map(
                        (status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(booking.id, status)}
                            disabled={booking.status === status}
                          >
                            {status}
                          </DropdownMenuItem>
                        )
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(booking.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => viewBooking(booking)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleConvertToClient(booking.id)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Convert to Client
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleArchive(booking.id)}>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(booking.id)}
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Consultation request from {selectedBooking?.fullName}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p>{selectedBooking.fullName}</p>
              </div>
              {selectedBooking.email && (
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p>{selectedBooking.email}</p>
                </div>
              )}
              {selectedBooking.phone && (
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p>{selectedBooking.phone}</p>
                </div>
              )}
              {selectedBooking.instagram && (
                <div>
                  <label className="text-sm font-medium">Instagram</label>
                  <p>{selectedBooking.instagram}</p>
                </div>
              )}
              {selectedBooking.message && (
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <p className="whitespace-pre-wrap">{selectedBooking.message}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Status</label>
                <p>
                  <Badge className={statusColors[selectedBooking.status]}>
                    {selectedBooking.status}
                  </Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Submitted</label>
                <p>{new Date(selectedBooking.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

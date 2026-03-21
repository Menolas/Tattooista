"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ClientForm } from "@/components/forms/client-form"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Star,
  Archive,
  Trash2,
  Plus,
} from "lucide-react"
import {
  toggleClientFavourite,
  archiveClient,
  deleteClient,
} from "@/lib/actions/clients"
import type { Client, Contact, ClientGalleryItem } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"

type ClientWithRelations = Client & {
  contacts: Contact[]
  gallery: ClientGalleryItem[]
}

interface ClientsTableProps {
  clients: ClientWithRelations[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientWithRelations | null>(null)

  const handleToggleFavourite = async (id: string) => {
    const result = await toggleClientFavourite(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Favourite status updated")
      router.refresh()
    }
  }

  const handleArchive = async (id: string) => {
    const result = await archiveClient(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Client archived")
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return

    const result = await deleteClient(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Client deleted")
      router.refresh()
    }
  }

  const getContactDisplay = (contacts: Contact[]) => {
    if (contacts.length === 0) return "No contacts"
    const contact = contacts[0]
    return contact.value
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client record.
              </DialogDescription>
            </DialogHeader>
            <ClientForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No clients yet.</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Gallery</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={client.avatar ? `/clients/${client.id}/avatar/${client.avatar}` : undefined}
                          alt={client.fullName}
                        />
                        <AvatarFallback>
                          {client.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{client.fullName}</span>
                          {client.isFavourite && (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {getContactDisplay(client.contacts)}
                  </TableCell>
                  <TableCell>
                    {client.gallery.length} image{client.gallery.length !== 1 ? "s" : ""}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(client.createdAt), {
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
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/clients/${client.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingClient(client)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleFavourite(client.id)}
                        >
                          <Star className="mr-2 h-4 w-4" />
                          {client.isFavourite
                            ? "Remove from Favourites"
                            : "Add to Favourites"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleArchive(client.id)}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(client.id)}
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
      <Dialog open={!!editingClient} onOpenChange={() => setEditingClient(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client information.
            </DialogDescription>
          </DialogHeader>
          {editingClient && (
            <ClientForm
              client={{
                id: editingClient.id,
                fullName: editingClient.fullName,
                avatar: editingClient.avatar,
                contacts: editingClient.contacts.map((c) => ({
                  type: c.type,
                  value: c.value,
                })),
              }}
              onSuccess={() => setEditingClient(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

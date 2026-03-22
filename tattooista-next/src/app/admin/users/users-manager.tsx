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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react"
import { deleteUser } from "@/lib/actions/users"
import { UserForm } from "./user-form"
import type { Role } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { userAvatarUrl } from "@/lib/image-utils"

interface User {
  id: string
  email: string
  displayName: string
  avatar: string | null
  isActivated: boolean
  roles: Role[]
  createdAt: Date
}

interface UsersManagerProps {
  users: User[]
  currentUserId: string
}

export function UsersManager({ users, currentUserId }: UsersManagerProps) {
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const handleDelete = async (id: string) => {
    if (id === currentUserId) {
      toast.error("You cannot delete your own account")
      return
    }

    if (!confirm("Are you sure you want to delete this user?")) return

    const result = await deleteUser(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("User deleted")
      router.refresh()
    }
  }

  const roleColors: Record<Role, string> = {
    USER: "bg-gray-100 text-gray-800",
    ADMIN: "bg-blue-100 text-blue-800",
    SUPERADMIN: "bg-purple-100 text-purple-800",
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account.
              </DialogDescription>
            </DialogHeader>
            <UserForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={user.avatar ? userAvatarUrl(user.id, user.avatar) : undefined}
                          alt={user.displayName}
                        />
                        <AvatarFallback>
                          {user.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.displayName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {user.roles.map((role) => (
                        <Badge
                          key={role}
                          className={roleColors[role]}
                          variant="secondary"
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.isActivated ? "default" : "secondary"}
                    >
                      {user.isActivated ? "Active" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(user.createdAt), {
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
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(user.id)}
                          className="text-destructive"
                          disabled={user.id === currentUserId}
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
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and roles.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <UserForm user={editingUser} onSuccess={() => setEditingUser(null)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

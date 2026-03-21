// User types
export type Role = "USER" | "ADMIN" | "SUPERADMIN"

export interface User {
  id: string
  email: string
  emailVerified: Date | null
  password: string
  displayName: string
  avatar: string | null
  roles: Role[]
  isActivated: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserWithoutPassword = Omit<User, "password">

// Client types
export interface Contact {
  id: string
  type: string // instagram, phone, email, whatsapp, messenger
  value: string
  clientId: string
}

export interface ClientGalleryItem {
  id: string
  fileName: string
  clientId: string
}

export interface Client {
  id: string
  fullName: string
  avatar: string | null
  isFavourite: boolean
  isArchived: boolean
  contacts: Contact[]
  gallery: ClientGalleryItem[]
  createdAt: Date
  updatedAt: Date
}

// Booking types
export type BookingStatus = "PENDING" | "CONTACTED" | "COMPLETED" | "CANCELLED"

export interface Booking {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  instagram: string | null
  message: string | null
  status: BookingStatus
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

// Review types
export interface ReviewGalleryItem {
  id: string
  fileName: string
  reviewId: string
}

export interface Review {
  id: string
  rate: number // 1-5
  content: string
  isArchived: boolean
  userId: string
  user?: UserWithoutPassword
  gallery: ReviewGalleryItem[]
  createdAt: Date
  updatedAt: Date
}

// Portfolio types
export interface TattooStyle {
  id: string
  value: string
  description: string | null
  wallPaper: string | null
  nonStyle: boolean
  isArchived: boolean
  galleryItems?: GalleryItem[]
  createdAt: Date
  updatedAt: Date
}

export interface GalleryItem {
  id: string
  fileName: string
  isArchived: boolean
  styles: TattooStyle[]
  createdAt: Date
}

// CMS types
export interface Service {
  id: string
  title: string
  wallPaper: string | null
  conditions: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Page {
  id: string
  name: string // about, contacts, etc.
  isActive: boolean
  title: string | null
  wallPaper: string | null
  content: string | null
  createdAt: Date
  updatedAt: Date
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  order: number
  createdAt: Date
  updatedAt: Date
}

// Form types
export interface BookingFormValues {
  fullName: string
  email?: string
  phone?: string
  instagram?: string
  message?: string
}

export interface LoginFormValues {
  email: string
  password: string
}

export interface RegisterFormValues {
  email: string
  password: string
  confirmPassword: string
  displayName: string
}

export interface ClientFormValues {
  fullName: string
  avatar?: string
  contacts: Array<{ type: string; value: string }>
}

export interface ReviewFormValues {
  rate: number
  content: string
  gallery?: string[]
}

export interface ServiceFormValues {
  title: string
  wallPaper?: string
  conditions?: string
  order?: number
}

export interface StyleFormValues {
  value: string
  description?: string
  wallPaper?: string
  nonStyle?: boolean
}

export interface FaqFormValues {
  question: string
  answer: string
  order?: number
}

export interface PageFormValues {
  name: string
  isActive?: boolean
  title?: string
  wallPaper?: string
  content?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Session types for NextAuth
export interface SessionUser {
  id: string
  email: string
  displayName: string
  avatar: string | null
  roles: Role[]
  isActivated: boolean
}

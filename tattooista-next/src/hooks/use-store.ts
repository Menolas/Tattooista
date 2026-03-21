import { create } from "zustand"

interface UIState {
  // Sidebar state (for mobile)
  isSidebarOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void

  // Modal state
  activeModal: string | null
  modalData: Record<string, unknown> | null
  openModal: (modalId: string, data?: Record<string, unknown>) => void
  closeModal: () => void

  // Toast notifications are handled by Sonner
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  isSidebarOpen: false,
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Modal
  activeModal: null,
  modalData: null,
  openModal: (modalId, data) =>
    set({ activeModal: modalId, modalData: data ?? null }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}))

// Gallery filter state
interface GalleryFilterState {
  selectedStyleId: string | null
  setSelectedStyleId: (id: string | null) => void
}

export const useGalleryFilterStore = create<GalleryFilterState>((set) => ({
  selectedStyleId: null,
  setSelectedStyleId: (id) => set({ selectedStyleId: id }),
}))

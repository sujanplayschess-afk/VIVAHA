import { create } from 'zustand'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

interface UIState {
  isMobileMenuOpen: boolean
  isNavbarScrolled: boolean
  activeModal: string | null
  toasts: Toast[]
  isDarkMode: boolean
  toggleDarkMode: () => void
  setDarkMode: (value: boolean) => void

  toggleMobileMenu: () => void
  setNavbarScrolled: (scrolled: boolean) => void
  openModal: (id: string) => void
  closeModal: () => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

let toastCounter = 0

function applyDarkClass(value: boolean) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', value)
  }
}

function getInitialDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem('vivahasetu-dark-mode')
  if (stored !== null) return stored === 'true'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  isNavbarScrolled: false,
  activeModal: null,
  toasts: [],
  isDarkMode: getInitialDarkMode(),

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.isDarkMode
      localStorage.setItem('vivahasetu-dark-mode', String(next))
      applyDarkClass(next)
      return { isDarkMode: next }
    }),

  setDarkMode: (value) => {
    localStorage.setItem('vivahasetu-dark-mode', String(value))
    applyDarkClass(value)
    set({ isDarkMode: value })
  },

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  setNavbarScrolled: (scrolled) => set({ isNavbarScrolled: scrolled }),

  openModal: (id) => set({ activeModal: id }),

  closeModal: () => set({ activeModal: null }),

  addToast: (toast) => {
    const id = `toast-${++toastCounter}`
    const newToast: Toast = { ...toast, id }
    set((state) => ({ toasts: [...state.toasts, newToast] }))

    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      }, toast.duration || 5000)
    }
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

// Apply the initial dark class on load
if (typeof window !== 'undefined') {
  applyDarkClass(getInitialDarkMode())
}

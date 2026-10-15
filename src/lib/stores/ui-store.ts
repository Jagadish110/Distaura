import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── UI Store ─────────────────────────────────────────────────
interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

// ── Admin Sidebar (persisted preference) ─────────────────────
interface AdminSidebarState {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggle: () => void;
}

export const useAdminSidebarStore = create<AdminSidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      setCollapsed: (v) => set({ collapsed: v }),
      toggle: () => set((s) => ({ collapsed: !s.collapsed })),
    }),
    { name: 'distaura-admin-sidebar' },
  ),
);

// ── Catalogue Filters (portal product browsing) ──────────────
interface CatalogueFiltersState {
  search: string;
  category: string;
  planType: string;
  setSearch: (v: string) => void;
  setCategory: (v: string) => void;
  setPlanType: (v: string) => void;
  reset: () => void;
}

export const useCatalogueFilters = create<CatalogueFiltersState>()((set) => ({
  search: '',
  category: '',
  planType: '',
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setPlanType: (planType) => set({ planType }),
  reset: () => set({ search: '', category: '', planType: '' }),
}));

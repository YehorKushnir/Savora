"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type SidebarType = "full" | "fixed"

interface SidebarState {
    isOpen: boolean
    type: SidebarType
    hydrated: boolean

    toggle: () => void
    setOpen: (open: boolean) => void
    setType: (type: SidebarType) => void
    toggleType: () => void
    setHydrated: (v: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            isOpen: true,
            type: "full",
            hydrated: false,

            toggle: () => set((s) => ({ isOpen: !s.isOpen })),
            setOpen: (open) => set({ isOpen: open }),

            setType: (type) => set({ type }),
            toggleType: () => set((s) => ({ type: s.type === "full" ? "fixed" : "full" })),

            setHydrated: (v) => set({ hydrated: v }),
        }),
        {
            name: "sidebar-storage",
            onRehydrateStorage: () => (state) => {
                if (state) state.setHydrated(true)
            },
        }
    )
)
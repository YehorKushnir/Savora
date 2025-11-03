import { create } from "zustand"
import { persist } from "zustand/middleware";

interface State {
    navbarState: boolean;
    toggleNavbar: () => void;
    isHydrated: boolean
    setHydrated: (v: boolean) => void
}

export const useNavbar = create<State>()(
    persist(
        (set) => ({
            navbarState: false,
            toggleNavbar: () => set((state) => ({ navbarState: !state.navbarState })),
            isHydrated: false,
            setHydrated: (v) => set({isHydrated: v})
        }),
        {
            name: "navbar-storage", // ключ в localStorage
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true)
            }
        }
    )
)
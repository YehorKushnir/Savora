import { create } from "zustand"
import { persist } from "zustand/middleware";

interface State {
    navbarState: boolean;
    toggleNavbar: () => void;
}

export const useNavbar = create<State>()(
    persist(
        (set) => ({
            navbarState: false,
            toggleNavbar: () => set((state) => ({ navbarState: !state.navbarState })),
        }),
        {
            name: "navbar-storage", // ключ в localStorage
        }
    )
)
import { create } from "zustand"
import { persist } from "zustand/middleware";

interface State {
    navbarState: "navbar" | "sidebar";
    toggleNavbar: () => void;
}

export const useNavbar = create<State>()(
    persist(
        (set) => ({
            navbarState: "navbar",
            toggleNavbar: () =>
                set((state) => ({
                    navbarState: state.navbarState === "navbar" ? "sidebar" : "navbar",
                })),
        }),
        {
            name: "navbar-storage", // ключ в localStorage
        }
    )
)
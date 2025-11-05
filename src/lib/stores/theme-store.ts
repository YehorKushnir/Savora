import {create} from 'zustand'
import {persist} from "zustand/middleware";

type ThemeMode = 'dark' | 'light'

interface State {
    theme: ThemeMode;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}

export const useTheme = create<State>()(
    persist(
        (set, get) => ({
            theme: "light",
            setTheme: (mode) => set({ theme: mode }),
            toggleTheme: () =>
                set({ theme: get().theme === "light" ? "dark" : "light" }),
        }),
        { name: "theme" }
    )
);
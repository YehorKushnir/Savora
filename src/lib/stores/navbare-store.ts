import { create } from "zustand"

interface State {
    navbarState: boolean;
    toggleNavbar: () => void;
}

export const useNavbar = create<State>((set) => ({
    navbarState: false,
    toggleNavbar: () => set((state) => ({ navbarState: !state.navbarState })),
}))
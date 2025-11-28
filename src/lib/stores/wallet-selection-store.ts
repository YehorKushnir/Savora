import { create } from 'zustand'

interface WalletSelectionState {
    activeWalletId: string | null
    setActiveWalletId: (id: string) => void
}

export const useWalletSelection = create<WalletSelectionState>((set) => ({
    activeWalletId: null,
    setActiveWalletId: (id) => set({ activeWalletId: id }),
}))
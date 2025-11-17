import {create} from 'zustand'

export interface Wallet {
    id: string
    name: string
    balance: string
    icon: string
    type: 'asset' | 'liability'
    currency: string
}

interface State {
    openModal: boolean
    openDeleteModal: boolean
    wallet?: Wallet
    storeWallets: Wallet[]
    setOpenModal: (value: boolean, initState?: Wallet) => void
    setOpenDeleteModal: (value: boolean, initState?: Wallet) => void
    columnOrder: string[]
    setColumnOrder: (columnOrder: string[]) => void
    setWallets: (wallets: Wallet[]) => void
    reorderWallets: (activeId: string, overId: string) => void
}

export const useWallets = create<State>((set) => ({
    openModal: false,
    openDeleteModal: false,
    wallet: undefined,
    storeWallets: [],
    columnOrder: [],
    setColumnOrder: (columnOrder) => set({columnOrder}),
    setOpenModal: (value, initState) => set({openModal: value, wallet: initState}),
    setOpenDeleteModal: (value, initState) => set({openDeleteModal: value, wallet: initState}),
    setWallets: (storeWallets) => set({storeWallets}),
    reorderWallets: (activeId, overId) => set((state) => {
        const oldIndex = state.storeWallets.findIndex((wallet) => wallet.id === activeId)
        const newIndex = state.storeWallets.findIndex((wallet) => wallet.id === overId)

        if (oldIndex === -1 || newIndex === -1) return { ...state }

        const newWallets = [...state.storeWallets]
        const [removed] = newWallets.splice(oldIndex, 1)
        newWallets.splice(newIndex, 0, removed)

        return { storeWallets: newWallets }
    }),
}))

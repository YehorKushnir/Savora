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
    setOpenModal: (value: boolean, initState?: Wallet) => void
    setOpenDeleteModal: (value: boolean, initState?: Wallet) => void
}

export const useWallets = create<State>((set) => ({
    openModal: false,
    openDeleteModal: false,
    wallet: undefined,
    setOpenModal: (value, initState) => set({openModal: value, wallet: initState}),
    setOpenDeleteModal: (value, initState) => set({openDeleteModal: value, wallet: initState})
}))

import {create} from 'zustand'
import {TTransaction} from '@/src/components/transaction-modal'

interface State {
    openModal: boolean
    openDeleteModal: boolean
    transaction?: TTransaction
    setOpenModal: (value: boolean, initState?: TTransaction) => void
    setOpenDeleteModal: (value: boolean, initState?: TTransaction) => void
}

export const useTransactions = create<State>((set) => ({
    openModal: false,
    openDeleteModal: false,
    transaction: undefined,
    setOpenModal: (value, initState) => set({openModal: value, transaction: initState}),
    setOpenDeleteModal: (value, initState) => set({openDeleteModal: value, transaction: initState})
}))

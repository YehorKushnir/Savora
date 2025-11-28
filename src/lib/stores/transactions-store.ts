import {create} from 'zustand'
import { TransactionWithRelations } from '@/src/lib/types/transactions'

interface State {
    openModal: boolean
    openDeleteModal: boolean
    transaction?: TransactionWithRelations
    searchValue: string,
    type: string
    columnOrder: string[]
    setColumnOrder: (columnOrder: string[]) => void
    setSearchValue: (value: string) => void
    setOpenModal: (value: boolean, initState?: TransactionWithRelations) => void
    setOpenDeleteModal: (value: boolean, initState?: TransactionWithRelations) => void
    setType: (value: string ) => void
}

export const useTransactions = create<State>((set) => ({
    openModal: false,
    openDeleteModal: false,
    transaction: undefined,
    searchValue: '',
    type: 'all',
    columnOrder: [],
    setColumnOrder: (columnOrder) => set({columnOrder}),
    setType: (type => {set({type})}),
    setOpenModal: (value, initState) => set({openModal: value, transaction: initState}),
    setOpenDeleteModal: (value, initState) => set({openDeleteModal: value, transaction: initState}),
    setSearchValue: (value => {set({searchValue: value})})
}))

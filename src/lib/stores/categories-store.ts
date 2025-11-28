import {create} from 'zustand'

export interface Category {
    id: string
    name: string
    icon: string | null
    type: 'income' | 'expense'
}

interface State {
    openModal: boolean
    openDeleteModal: boolean
    category?: Category
    openSubcategoryModal: boolean
    openSubcategoryDeleteModal: boolean
    categoryId: string
    type: string
    appearance: string
    searchValue: string
    setSearchValue: (value: string) => void
    setAppearance: (view: string) => void
    setOpenModal: (value: boolean, initState?: Category) => void
    setOpenDeleteModal: (value: boolean, initState?: Category) => void
    setType: (value: string) => void
}

export const useCategories = create<State>((set) => ({
    openModal: false,
    openDeleteModal: false,
    category: undefined,
    openSubcategoryModal: false,
    openSubcategoryDeleteModal: false,
    subcategory: undefined,
    appearance: 'table',
    setAppearance: (appearance) => set({appearance}),
    categoryId: '',
    type: 'all',
    searchValue: '',
    setSearchValue: (value) => set({searchValue: value}),
    setOpenModal: (value, initState) => set({openModal: value, category: initState}),
    setOpenDeleteModal: (value, initState) => set({openDeleteModal: value, category: initState}),
    setType: (type) => set({type})
}))

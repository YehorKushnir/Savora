import {create} from 'zustand'

export interface Category {
    id: string
    name: string
    icon: string
    type: 'income' | 'expense'
}

export interface Subcategory {
    id: string
    name: string
    categoryId: string
}

interface State {
    openModal: boolean
    openDeleteModal: boolean
    category?: Category
    openSubcategoryModal: boolean
    openSubcategoryDeleteModal: boolean
    subcategory?: Subcategory
    categoryId: string
    type: string
    appearance: string
    setAppearance: (view: string) => void
    setOpenModal: (value: boolean, initState?: Category) => void
    setOpenDeleteModal: (value: boolean, initState?: Category) => void
    setOpenSubcategoryModal: (value: boolean, categoryId?: string, initState?: Subcategory) => void
    setOpenSubcategoryDeleteModal: (value: boolean, initState?: Subcategory) => void
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
    setOpenModal: (value, initState) => set({openModal: value, category: initState}),
    setOpenDeleteModal: (value, initState) => set({openDeleteModal: value, category: initState}),
    setOpenSubcategoryModal: (value, categoryId, initState) => set({openSubcategoryModal: value, subcategory: initState, categoryId}),
    setOpenSubcategoryDeleteModal: (value, initState) => set({openSubcategoryDeleteModal: value, subcategory: initState}),
    setType: (type) => set({type})
}))

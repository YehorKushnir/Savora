import {create} from 'zustand'

interface State {
    setType: (value: string ) => void,
    type: string
    searchValue: string,
    setSearchValue: (value: string) => void
}

export const useTypeOptions = create<State>((set) => ({
    type: 'all',
    setType: (type => {set({type})}),
    searchValue: '',
    setSearchValue: (value => {set({searchValue: value})})
}))
import {create} from 'zustand'

interface State {
    setType: (value: string ) => void,
    type: string
}

export const useTypeOptions = create<State>((set) => ({
    type: 'all',
    setType: (type => {set({type})})
}))
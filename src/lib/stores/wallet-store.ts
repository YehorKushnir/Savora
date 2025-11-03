import {create} from 'zustand'

interface State {
    setType: (value: string) => void,
    type: string
}

export const useWallets = create<State>((set) => ({
    type: 'all',
    setType: (type => {set({type})})
}))
'use client'

import {ContextMenuItem} from '@/src/components/ui/context-menu'
import {FC} from 'react'
import {useWallets, Wallet} from '@/src/lib/stores/wallets-store'

interface Props {
    wallet: Wallet
}

const WalletListActions:FC<Props> = ({wallet}) => {
    const setOpenModal = useWallets(state => state.setOpenModal)
    const setOpenDeleteModal = useWallets(state => state.setOpenDeleteModal)

    return (
        <>
            <ContextMenuItem onClick={() => setOpenModal(true, wallet)}>Edit</ContextMenuItem>
            <ContextMenuItem onClick={() => setOpenDeleteModal(true, wallet)}>Delete</ContextMenuItem>
        </>
    )
}

export default WalletListActions
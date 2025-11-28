'use client'

import {ContextMenuItem} from '@/src/components/ui/context-menu'
import {FC} from 'react'
import {useWallets} from '@/src/lib/stores/wallets-store'
import {ClientWallet} from "@/src/lib/types/client-wallet-type";

interface Props {
    wallet: ClientWallet
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
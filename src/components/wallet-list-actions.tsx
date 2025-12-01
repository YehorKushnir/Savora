'use client'

import {ContextMenuItem} from '@/src/components/ui/context-menu'
import {FC} from 'react'
import {useWallets} from '@/src/lib/stores/wallets-store'
import {ClientWallet} from "@/src/lib/types/client-wallet-type";
import { useTranslations } from 'next-intl';

interface Props {
    wallet: ClientWallet
}

const WalletListActions:FC<Props> = ({wallet}) => {
    const setOpenModal = useWallets(state => state.setOpenModal)
    const setOpenDeleteModal = useWallets(state => state.setOpenDeleteModal)
    const t = useTranslations('Wallets.list');

    return (
        <>
            <ContextMenuItem onClick={() => setOpenModal(true, wallet)}>
                {t('edit')}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setOpenDeleteModal(true, wallet)}>
                {t('delete')}
            </ContextMenuItem>
        </>
    )
}

export default WalletListActions
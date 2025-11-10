'use client'

import {FC, useState, useEffect} from 'react'
import {Card, CardDescription, CardHeader, CardTitle} from '@/src/components/ui/card'
import LucideIcon, {IconName} from '@/src/components/lucide-icon'
import {ContextMenu, ContextMenuContent, ContextMenuTrigger} from '@/src/components/ui/context-menu'
import {getCurrencySymbol} from '@/src/lib/get-currency-symol'
import WalletListActions from '@/src/components/wallet-list-actions'
import {useSearchParams} from "next/navigation";
import {Wallet} from "@/src/lib/stores/wallets-store";

interface Props {
    wallets: Wallet[]
}

const WalletList: FC<Props> = ({wallets}) => {
    const searchParams = useSearchParams()
    const initialActive = searchParams.get('activeWallet')
        || (wallets.length ? wallets[0].id : '')
    const [active , setActive] =  useState(initialActive);

    useEffect(() => {
        const current = searchParams.get('activeWallet')
        if (current && current !== active) {
            setActive(current)
        }
    }, [searchParams])

    function updateActiveWallet(walletId: string) {
        const params = new URLSearchParams(searchParams.toString())
        setActive(walletId)
        params.set('activeWallet', walletId)
        window.history.pushState(null, '', `?${params.toString()}`)
    }

    const clsx = (id : string) => {
        return active === id ? 'border-2 border-[var(--accent-foreground)]' : 'border-2 border-transparent'
    }

    return (
        <>
            {wallets.map((item) => (
                <ContextMenu key={item.id}>
                    <ContextMenuTrigger className={'w-full'}>
                        <Card onClick={() => updateActiveWallet(item.id)} className={`w-full flex flex-row gap-4 items-center py-2 px-4 rounded-md cursor-pointer border-2 border-transparent ${clsx(item.id)}`}>
                            <LucideIcon name={item.icon as IconName} size={40}/>
                            <CardHeader className={'w-full p-0'}>
                                <CardTitle className={'flex'}>{item.name}</CardTitle>
                                <CardDescription>{getCurrencySymbol(item.currency)} {`${item.balance}`}</CardDescription>
                            </CardHeader>
                        </Card>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <WalletListActions wallet={{...item, balance: String(item.balance)}}/>
                    </ContextMenuContent>
                </ContextMenu>
            ))}
        </>
    )
}

export default WalletList
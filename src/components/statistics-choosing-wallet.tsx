'use client'

import {Button} from "@/src/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {useSearchParams} from "next/navigation";
import {ChevronDownIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {Wallet} from "@/src/lib/types/wallets";
import queryString from 'query-string';

type Props = {
    wallets: Wallet[]
}

export function StatisticsChoosingWallet({wallets}: Props) {
    const searchParams = useSearchParams()

    const initialDisabled = (() => {
        const parsed = queryString.parse(window.location.search);
        if (typeof parsed.disabledWallets === 'string') {
            return parsed.disabledWallets.split(',').filter(Boolean);
        }
        return [];
    })()

    const [activeWallets, setActiveWallets] = useState<string[]>(
        wallets.map(wallet => wallet.id).filter(id => !initialDisabled.includes(id))
    )

    function writeDisabledToParams(disabled: string[]) {
        const current = queryString.parse(window.location.search);
        const updated = {
            ...current,
            disabledWallets: disabled.length ? disabled.join(',') : undefined,
        };
        const newUrl = queryString.stringifyUrl({ url: window.location.pathname, query: updated }, { skipNull: true, skipEmptyString: true });
        window.history.pushState(null, '', newUrl);
    }

    function toggleWallet(walletId: string, checked: boolean) {
        setActiveWallets(prev => {
            const next = checked ? [...prev, walletId].filter((walletId, index, Array) => Array.indexOf(walletId) === index) : prev.filter(id => id !== walletId)

            const allIds = wallets.map(wallet => wallet.id)
            const disabled = allIds.filter(id => !next.includes(id))
            writeDisabledToParams(disabled)

            return next
        })
    }

    useEffect(() => {
        const parsed = queryString.parse(window.location.search);
        const disabled = typeof parsed.disabledWallets === 'string'
            ? parsed.disabledWallets.split(',').filter(Boolean)
            : [];
        const newActive = wallets.map(wallet => wallet.id).filter(id => !disabled.includes(id));
        setActiveWallets(prev => {
            const same = prev.length === newActive.length && prev.every(id => newActive.includes(id))
            return same ? prev : newActive
        })
    }, [searchParams, wallets])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between">
                    {activeWallets.length === wallets.length
                        ? "All wallets active"
                        : `${activeWallets.length} selected`}
                    <ChevronDownIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {wallets.map((wallet: Wallet) => {
                    return (
                        <DropdownMenuCheckboxItem
                            key={wallet.id}
                            className="capitalize"
                            checked={activeWallets.includes(wallet.id)}
                            onCheckedChange={(checked) => toggleWallet(wallet.id, checked)}
                        >
                            {wallet.name}
                        </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

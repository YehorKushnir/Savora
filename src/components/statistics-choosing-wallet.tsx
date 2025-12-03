'use client'

import { Button } from "@/src/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuItem
} from "@/src/components/ui/dropdown-menu"
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";
import { use, useEffect, useMemo } from "react";
import { ClientWallet } from "@/src/lib/types/client-wallet-type";
import { useTranslations } from 'next-intl';
import { useWallets } from "@/src/lib/stores/wallets-store";

interface Props {
    wallets: Promise<ClientWallet[]>
}

export function StatisticsChoosingWallet({ wallets }: Props) {
    const walletsData = use(wallets)
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const t = useTranslations('Statistics.filters');

    const activeWallets = useWallets((state) => state.activeWallets)
    const setActiveWallets = useWallets((state) => state.setActiveWallets)

    const allWalletIds = useMemo(() => walletsData.map(w => w.id), [walletsData]);

    useEffect(() => {
        const disabledParam = searchParams.get('disabledWallets');

        const disabledWallets = disabledParam
            ? disabledParam.split(',').filter(Boolean)
            : [];

        const newActiveWallets = allWalletIds.filter(id => !disabledWallets.includes(id));

        const isDifferent =
            newActiveWallets.length !== activeWallets.length ||
            !newActiveWallets.every(id => activeWallets.includes(id));

        if (isDifferent) {
            setActiveWallets(newActiveWallets);
        }
    }, [searchParams, allWalletIds]);

    const updateUrl = (newActiveIds: string[]) => {
        const disabled = allWalletIds.filter(id => !newActiveIds.includes(id));

        const params = new URLSearchParams(searchParams.toString());

        if (disabled.length > 0) {
            params.set('disabledWallets', disabled.join(','));
        } else {
            params.delete('disabledWallets');
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    function toggleWallet(walletId: string, checked: boolean) {
        let nextActive: string[];

        if (checked) {
            nextActive = [...activeWallets, walletId];
        } else {
            nextActive = activeWallets.filter(id => id !== walletId);
        }

        const uniqueNext = Array.from(new Set(nextActive));

        setActiveWallets(uniqueNext);
        updateUrl(uniqueNext);
    }

    const toggleAll = () => {
        if (activeWallets.length === allWalletIds.length) {
            setActiveWallets([]);
            updateUrl([]);
        } else {
            setActiveWallets(allWalletIds);
            updateUrl(allWalletIds);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between w-full sm:w-auto">
                    {activeWallets.length === walletsData.length
                        ? t('all_wallets')
                        : t('selected_wallets', { count: activeWallets.length })}
                    <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        toggleAll();
                    }}
                    className="font-medium cursor-pointer"
                >
                    {activeWallets.length === walletsData.length ? 'Deselect All' : 'Select All'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {walletsData.map((wallet: ClientWallet) => {
                    return (
                        <DropdownMenuCheckboxItem
                            key={wallet.id}
                            className="capitalize cursor-pointer"
                            checked={activeWallets.includes(wallet.id)}
                            onCheckedChange={(checked) => toggleWallet(wallet.id, checked)}
                            onSelect={(e) => e.preventDefault()}
                        >
                            {wallet.name}
                        </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

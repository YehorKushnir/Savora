import WalletList from '@/src/components/wallet-list'
import {Suspense} from 'react'
import WalletModal from '@/src/components/wallet-modal'
import {Skeleton} from '@/src/components/ui/skeleton'
import {getCurrencies, getTransactions} from '@/src/app/(dashboard)/actions'
import WalletDeleteModal from '@/src/components/wallet-delete-modal'
import {WalletTable} from "@/src/components/wallet-table";
import {getWallets} from '@/src/app/(dashboard)/wallets/actions'

export default async function Wallets() {
    const currencies = getCurrencies()
    const transactions = await getTransactions()
    const wallets = await getWallets()

    return (
        <div className={'w-full flex gap-4'}>
            <div className={'min-w-60 flex flex-col items-center gap-4'}>
                <WalletModal currencies={currencies}/>
                <WalletDeleteModal/>
                <Suspense fallback={<Skeleton className={'w-full h-15 rounded-md'}/>}>
                    <WalletList wallets={wallets}/>
                </Suspense>
            </div>
            <div className={'w-full flex flex-col items-center'}>
                <Suspense fallback={<Skeleton className={'w-full h-[500px]'}/>}>
                    <WalletTable data={transactions}/>
                </Suspense>
            </div>
        </div>
    )
}
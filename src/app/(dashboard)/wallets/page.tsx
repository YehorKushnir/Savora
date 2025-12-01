import WalletList from '@/src/components/wallet-list'
import {Suspense} from 'react'
import WalletModal from '@/src/components/wallet-modal'
import {Skeleton} from '@/src/components/ui/skeleton'
import {getCurrencies} from '@/src/app/(dashboard)/actions'
import WalletDeleteModal from '@/src/components/wallet-delete-modal'
import {WalletTable} from "@/src/components/wallet-table";
import {getWallets} from '@/src/app/(dashboard)/wallets/actions'
import {getTransactions} from '@/src/app/(dashboard)/transactions/actions'
import TransactionModal from "@/src/components/transaction-modal";
import {getCategories} from "@/src/app/(dashboard)/categories/actions";
import TransactionDeleteModal from "@/src/components/transaction-delete-modal";
import {WalletOptions} from "@/src/components/wallet-options";

export default async function Wallets() {
    const currencies = getCurrencies()
    const categories = getCategories()
    const transactions = getTransactions()
    const wallets = getWallets()

    return (
        <div className={'w-full flex gap-4'}>
            <div className={'min-w-60 flex flex-col items-center gap-4'}>
                <WalletModal currencies={currencies}/>
                <WalletDeleteModal/>
                <TransactionModal categories={categories} wallets={wallets}/>
                <TransactionDeleteModal/>
                <Suspense fallback={<Skeleton className={'w-full h-15 rounded-md'}/>}>
                    <WalletList wallets={wallets}/>
                </Suspense>
            </div>
            <div className={'w-full flex flex-col items-center gap-4'}>
                <WalletOptions/>
                <Suspense fallback={<Skeleton className={'w-full h-[500px]'}/>}>
                    <WalletTable transactions={transactions}/>
                </Suspense>
            </div>
        </div>
    )
}
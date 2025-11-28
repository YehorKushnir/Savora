import {Suspense} from 'react'
import {Skeleton} from '@/src/components/ui/skeleton'
import TransactionModal from '@/src/components/transaction-modal'
import TransactionDeleteModal from '@/src/components/transaction-delete-modal'
import {getCategories} from '@/src/app/(dashboard)/categories/actions'
import {getWallets} from '@/src/app/(dashboard)/wallets/actions'
import {getTransactions} from '@/src/app/(dashboard)/transactions/actions'
import TransactionTable from "@/src/components/transaction-table";

export default function Transactions() {
    const categories = getCategories()
    const wallets = getWallets()
    const transactions = getTransactions()

    return (
        <div className={'w-full flex'}>
            <div className={'w-full flex flex-col items-center'}>
                <TransactionModal categories={categories} wallets={wallets}/>
                <TransactionDeleteModal/>
                <div className="w-full flex flex-col items-center">
                    <Suspense fallback={<Skeleton className={'w-full h-[500px]'}/>}>
                        <TransactionTable transactions={transactions}/>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
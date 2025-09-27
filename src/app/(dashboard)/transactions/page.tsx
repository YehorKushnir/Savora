import {Suspense} from 'react'
import {Skeleton} from '@/src/components/ui/skeleton'
import TransactionModal from '@/src/components/transaction-modal'
import TransactionDeleteModal from '@/src/components/transaction-delete-modal'
import {getCategories} from '@/src/app/(dashboard)/categories/actions'
import TransactionOptions from '@/src/components/transaction-options'
import {getWallets} from '@/src/app/(dashboard)/wallets/actions'

export default function Transactions() {
    const categories = getCategories()
    const wallets = getWallets()

    return (
        <div className={'w-full flex'}>
            <div className={'w-full flex flex-col items-center'}>
                <TransactionModal categories={categories} wallets={wallets}/>
                <TransactionDeleteModal/>
                <div className="w-full flex flex-col gap-4">
                    <TransactionOptions/>
                    <Suspense fallback={<Skeleton className={'w-full h-[500px]'}/>}>
                        {/*<TransactionTable />*/}
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
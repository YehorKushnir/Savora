import WalletList from '@/src/components/wallet-list'
import {Suspense} from 'react'
import WalletModal from '@/src/components/wallet-modal'
import {Skeleton} from '@/src/components/ui/skeleton'
import {getCurrencies} from '@/src/app/(dashboard)/actions'
import WalletDeleteModal from '@/src/components/wallet-delete-modal'

export default async function Accounts() {
    const currencies = getCurrencies()

    return (
        <div className={'w-full flex'}>
            <div className={'min-w-60 flex flex-col items-center gap-2'}>
                <WalletModal currencies={currencies}/>
                <WalletDeleteModal/>
                <Suspense fallback={<Skeleton className={'w-full h-15 rounded-md'}/>}>
                    <WalletList/>
                </Suspense>
            </div>
            <div className={'w-full flex flex-col items-center'}>

            </div>
        </div>
    )
}
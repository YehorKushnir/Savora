'use client'

import {Button} from '@/src/components/ui/button'
import {useTransactions} from '@/src/lib/stores/transactions-store'

export default function TransactionOptions() {
    const setOpenModal = useTransactions((state) => state.setOpenModal)

    return (
        <div className={'w-full flex justify-between'}>
            <Button onClick={() => setOpenModal(true)}>
                Add transaction
            </Button>
        </div>
    )
}


'use client'

import {Button} from '@/src/components/ui/button'
import {useTransactions} from '@/src/lib/stores/transactions-store'
import {SavoraSearch} from "@/src/components/savora-search";
import {TableOptions} from "@/src/components/table-options";

export default function TransactionOptions() {
    const setOpenModal = useTransactions((state) => state.setOpenModal)
    const searchValue = useTransactions((state) => state.searchValue)
    const setSearchValue = useTransactions((state) => state.setSearchValue)

    return (
        <div className="w-full flex items-center gap-4 justify-between">
            <div className={'w-full flex gap-4'}>
                <Button onClick={() => setOpenModal(true)}>
                    Add transaction
                </Button>
                <SavoraSearch
                    value={searchValue}
                    onChangeAction={setSearchValue}
                />
            </div>
            <div className="flex gap-4 items-center">
                <TableOptions/>
            </div>
        </div>
    )
}


'use client'

import {Button} from '@/src/components/ui/button'
import {useTransactions} from '@/src/lib/stores/transactions-store'
import {SavoraSearch} from "@/src/components/savora-search";
import {TableOptions} from "@/src/components/table-options";
import { useTranslations } from 'next-intl';

export default function TransactionOptions() {
    const setOpenModal = useTransactions((state) => state.setOpenModal)
    const searchValue = useTransactions((state) => state.searchValue)
    const setSearchValue = useTransactions((state) => state.setSearchValue)

    const t = useTranslations('Transactions');

    return (
        <div className="w-full flex items-center gap-4 justify-between">
            <div className={'w-full flex gap-4'}>
                <Button onClick={() => setOpenModal(true)}>
                    {t('add_btn')}
                </Button>
                <TableOptions/>
            </div>
            <SavoraSearch
                value={searchValue}
                onChangeAction={setSearchValue}
            />
        </div>
    )
}

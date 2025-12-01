'use client'

import {SavoraSearch} from "@/src/components/savora-search";
import {TableOptions} from "@/src/components/table-options";
import {useTypeOptions} from "@/src/lib/stores/type-options-store";


export const WalletOptions = () => {
    const searchValue = useTypeOptions(state => state.searchValue)
    const setSearchValue = useTypeOptions(state => state.setSearchValue)

    return (
        <div className="w-full flex items-center gap-4 justify-between">
            <SavoraSearch
                value={searchValue}
                onChangeAction={setSearchValue}
            />
            <div className="flex items-center gap-4">
                <TableOptions />
            </div>
        </div>
    )
}
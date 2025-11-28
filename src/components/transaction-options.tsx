'use client'

import {Button} from '@/src/components/ui/button'
import {useTransactions} from '@/src/lib/stores/transactions-store'
import {SavoraSearch} from "@/src/components/savora-search";
import {TableOptions} from "@/src/components/table-options";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import {Table as ReactTableInstance} from "@tanstack/react-table";

interface Props {
    table: ReactTableInstance<any>
}

export default function TransactionOptions({table}: Props) {
    const setOpenModal = useTransactions((state) => state.setOpenModal)
    const searchValue = useTransactions((state) => state.searchValue)
    const setSearchValue = useTransactions((state) => state.setSearchValue)

    return (
        <div className="flex items-center justify-between">
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter(column => column.getCanHide())
                            .map(column => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={value => column.toggleVisibility(value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}


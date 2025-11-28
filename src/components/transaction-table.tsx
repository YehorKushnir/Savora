"use client"

import {use, useEffect, useMemo, useState} from "react"
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    VisibilityState,
    PaginationState,
    useReactTable, OnChangeFn, ColumnOrderState,
} from "@tanstack/react-table"

import { useTransactions } from "@/src/lib/stores/transactions-store"
import TransactionOptions from "@/src/components/transaction-options"
import { useTransactionGlobalFilter } from "@/src/hooks/use-wallet-global-filter"
import { PropsTransactionInterface } from "@/src/lib/types/props-transaction-interface"

import { DataTable } from "@/src/components/data-table/data-table"
import {useTransactionColumns} from "@/src/components/data-table/use-transaction-columns";
import {useWallets} from "@/src/lib/stores/wallets-store";

export default function TransactionTable(props: PropsTransactionInterface) {
    const filterType = useTransactions(state => state.type)
    const searchValue = useTransactions(state => state.searchValue)
    const data = use(props.transactions)
    const tableData = useMemo(() => {
        let filtered = data
        if (filterType !== "all") {
             filtered = filtered.filter(item => item.type === filterType)
        }

        return filtered
    }, [data, filterType])
    const globalFilterFn = useTransactionGlobalFilter()

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 15,
    })

    const columns = useTransactionColumns()

    const columnOrderStore = useWallets(state => state.columnOrder)
    const setColumnOrderStore = useWallets(state => state.setColumnOrder)

    const defaultOrder = useMemo(() =>
            columns.map(c => c.id || (c as any).accessorKey || ""),
        [columns])

    const [columnOrder, setColumnOrder] = useState<string[]>(() => {
        if (columnOrderStore && columnOrderStore.length > 0) {
            return columnOrderStore
        }
        return defaultOrder
    })

    useEffect(() => {
        if (columnOrderStore.length === 0 && defaultOrder.length > 0) {
            setColumnOrderStore(defaultOrder)
        }
    }, [defaultOrder, columnOrderStore.length, setColumnOrderStore])

    const handleColumnOrderChange: OnChangeFn<ColumnOrderState> = (updaterOrValue) => {
        const newOrder = typeof updaterOrValue === 'function'
            ? updaterOrValue(columnOrder)
            : updaterOrValue

        setColumnOrder(newOrder)
        setColumnOrderStore(newOrder)
    }

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: globalFilterFn,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        onColumnOrderChange: handleColumnOrderChange,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
            columnOrder,
            globalFilter: searchValue
        },
    })

    return (
        <DataTable
            table={table}
            columnOrder={columnOrder}
            setColumnOrder={handleColumnOrderChange as (order: string[]) => void}
        >
            <TransactionOptions table={table} />
        </DataTable>
    )
}
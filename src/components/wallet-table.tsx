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
    useReactTable,
    OnChangeFn,
    ColumnOrderState
} from "@tanstack/react-table"

import {useTypeOptions} from "@/src/lib/stores/type-options-store"
import {useWallets} from "@/src/lib/stores/wallets-store"
import {PropsTransactionInterface} from '@/src/lib/types/props-transaction-interface'
import {useTransactionGlobalFilter} from "@/src/hooks/use-wallet-global-filter"

import {DataTable} from "@/src/components/data-table/data-table"
import {useTransactionColumns} from "@/src/components/data-table/use-transaction-columns"

import {useWalletSelection} from "@/src/lib/stores/wallet-selection-store"

export function WalletTable(props: PropsTransactionInterface) {
    const data = use(props.transactions)
    
    const activeWalletId = useWalletSelection(state => state.activeWalletId)

    const walletFilterType = useTypeOptions(state => state.type)
    const searchValue = useTypeOptions(state => state.searchValue)

    const columns = useTransactionColumns()

    const tableData = useMemo(() => {
        let filtered = activeWalletId
            ? data.filter(tx => tx.entries.some(entry => entry.vaultId === activeWalletId))
            : data

        if (walletFilterType !== "all") {
            filtered = filtered.filter(item => item.type === walletFilterType)
        }

        return filtered
    }, [data, activeWalletId, walletFilterType])

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 15,
    })

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

    const globalFilterFn = useTransactionGlobalFilter()

    useEffect(() => {
        if (columnOrderStore.length === 0 && defaultOrder.length > 0) {
            setColumnOrderStore(defaultOrder)
        }
    }, [defaultOrder, columnOrderStore.length, setColumnOrderStore])

    useEffect(() => {
        if (columnOrderStore.length > 0 && JSON.stringify(columnOrderStore) !== JSON.stringify(columnOrder)) {
            setColumnOrder(columnOrderStore)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnOrderStore])

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
        filterFromLeafRows: false,
        enableGlobalFilter: true,
        globalFilterFn: globalFilterFn,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        onColumnOrderChange: handleColumnOrderChange,
        state: {
            columnOrder,
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
            globalFilter: searchValue,
        },
    })

    return (
        <DataTable
            table={table}
            columnOrder={columnOrder}
            setColumnOrder={handleColumnOrderChange as (order: string[]) => void}
        >
        </DataTable>
    )
}
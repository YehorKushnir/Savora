"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    SortingState,
    VisibilityState,
    PaginationState,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"

import { useEffect, useRef, useState } from "react"
import { WalletTablePagination } from "@/src/components/wallet-pagination"
import { useWallets } from "@/src/lib/stores/wallet-store"
import WalletOptions from "@/src/components/wallet-options"
import { useWalletGlobalFilter } from "@/src/hooks/use-wallet-global-filter"
import { WalletSearch } from "@/src/components/wallet-search"
import { Transaction, TransactionEntry } from "@/src/lib/types/transactions"

export const columns: ColumnDef<Transaction | TransactionEntry>[] = [
    {
        id: "expander",
        header: "",
        cell: ({ row }) =>
            row.getCanExpand() ? (
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={row.getToggleExpandedHandler()}
                >
                    {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
                </Button>
            ) : null,
        enableSorting: false,
        enableHiding: false,
        size: 67,
        minSize: 56,
    },
    {
        accessorKey: "executedAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Executed At
                <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => {
            if (row.depth === 1) return <div className="px-4" />
            const date = new Date(row.getValue("executedAt") as string)
            return <div className="px-4">{date.toLocaleDateString()}</div>
        },
        size: 198,
        minSize: 140,
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <Button
                className="text-left has-[>svg]:px-0"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Type
                <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => {
            if (row.depth === 1) {
                const entry = row.original as any
                const isCredit = entry.type === "credit"
                return (
                    <div
                        className={`capitalize ${
                            isCredit ? "text-red-600" : "text-green-600"
                        }`}
                    >
                        {entry.type ?? ""}
                    </div>
                )
            }
            return (
                <div className="capitalize">{row.getValue("type") as string}</div>
            )
        },
        size: 100,
        minSize: 80,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            if (row.depth === 1) {
                const entry = row.original as any
                return <div>{entry.vaultId ?? ""}</div>
            }
            return <div>{row.getValue("description") as string}</div>
        },
        size: 251,
        minSize: 180,
    },
    {
        accessorKey: "baseAmount",
        header: () => <div className="text-center">Amount</div>,
        cell: ({ row }) => {
            if (row.depth === 1) {
                const entry = row.original as any
                const amount = Number(entry.amount ?? 0)
                return (
                    <div className="text-center font-medium">
                        {amount.toFixed(2)}
                    </div>
                )
            }

            const amount = Number(row.getValue("baseAmount") ?? 0)
            const currency = String(row.getValue("currency") ?? "EUR")

            const formatted = new Intl.NumberFormat(undefined, {
                style: "currency",
                currency,
            }).format(amount)

            return <div className="text-center font-medium">{formatted}</div>
        },
        size: 120,
        minSize: 100,
    },
    {
        accessorKey: "currency",
        header: () => <div className="text-center">Currency</div>,
        cell: ({ row }) => {
            if (row.depth === 1) {
                return <div className="text-center h-5" />
            }
            return (
                <div className="text-center">
                    {row.getValue("currency") as string}
                </div>
            )
        },
        size: 106,
        minSize: 80,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            if (row.depth === 1) {
                return <div className="h-5" />
            }
            const transaction = row.original as any
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(transaction.id)
                            }
                        >
                            Copy transaction ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View account details</DropdownMenuItem>
                        <DropdownMenuItem>View transaction details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        size: 67,
        minSize: 56,
    },
]

export function WalletTable({ data = [] }: { data?: Transaction[] }) {
    const safeData = Array.isArray(data) ? data : []
    const walletFilterType = useWallets(state => state.type)

    const [tableData, setTableData] = useState<Transaction[]>(safeData)

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const [searchValue, setSearchValue] = useState<string>("")
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const prevSearchRef = useRef("")

    const globalFilterFn = useWalletGlobalFilter(expanded)

    useEffect(() => {
        setTableData(() =>
            walletFilterType === "all"
                ? safeData
                : safeData.filter(item => item.type === walletFilterType),
        )
    }, [safeData, walletFilterType])

    useEffect(() => {
        const previous = prevSearchRef.current.trim()
        const current = searchValue.trim()

        const hadPrevSearch = previous.length > 0
        const hasCurrentSearch = current.length > 0

        if (!hadPrevSearch && hasCurrentSearch) {
            setExpanded({})
        }

        prevSearchRef.current = current
    }, [searchValue])

    const table = useReactTable({
        data: tableData,
        columns,
        getRowId: (row: any, index, parent) => {
            if (!parent) {
                return row.id ? String(row.id) : `tx-${index}`
            }
            const entryKey = row.vaultId ?? row.type ?? index
            return `${parent.id}.${entryKey}`
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        paginateExpandedRows: false,
        filterFromLeafRows: false,
        enableGlobalFilter: true,
        getRowCanExpand: row =>
            Array.isArray((row.original as any).entries) &&
            (row.original as any).entries.length > 0,
        getSubRows: (row: any) => row.entries ?? [],
        globalFilterFn: globalFilterFn,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        onExpandedChange: (updater) => {
            setExpanded((prev) => {
                if (typeof updater === "function") {
                    return (updater as (old: Record<string, boolean>) => Record<string, boolean>)(prev)
                }
                return updater as Record<string, boolean>
            })
        },
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
            expanded,
            globalFilter: searchValue,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center gap-4 justify-between pb-4">
                <WalletSearch
                    value={searchValue}
                    onChangeAction={setSearchValue}
                />
                <div className="flex items-center gap-4">
                    <WalletOptions />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown />
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
                                            onCheckedChange={value =>
                                                column.toggleVisibility(value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: header.getSize() }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell
                                            key={cell.id}
                                            style={{ width: cell.column.getSize() }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <WalletTablePagination table={table} />
        </div>
    )
}

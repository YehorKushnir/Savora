"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
    PaginationState, getExpandedRowModel,
} from "@tanstack/react-table"
import {ArrowUpDown, ChevronDown, ChevronRight, MoreHorizontal} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Input } from "@/src/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"
import {Transaction, TransactionEntry,} from "@/src/lib/types/transactions";
import {useEffect, useState} from "react";
import {WalletTablePagination} from "@/src/components/wallet-pagination";

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
      if (row.depth === 1) return <div className="px-4"/>
      const date = new Date(row.getValue("executedAt"))
      return <div className="px-4">{date.toLocaleDateString()}</div>
    },
    size:198,
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
      // child row (entry)
      if (row.depth === 1) {
        const entry = row.original as any
        return <div className="capitalize pl-6">{entry.type ?? ""}</div>
      }
      // parent row
      return <div className="capitalize">{row.getValue("type") as string}</div>
    },
    size:100,
    minSize: 80,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      // child entry row
      if (row.depth === 1) {
        const entry = row.original as any
        return <div className="pl-6">{entry.vaultId ?? ''}</div>
      }
      // parent row — just description
      return <div>{row.getValue("description") as string}</div>
    },
    size:251,
    minSize: 180,
  },
  {
    accessorKey: "baseAmount",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      // В подстроках общую сумму не показываем
      if (row.depth === 1) {
        const entry = row.original as any
        const isCredit = entry.type === "credit";
        const amount = Number(entry.amount ?? 0)
        return <div className={`text-center font-medium ${isCredit ? "text-red-600" : "text-green-600"}`}>{amount.toFixed(2)}</div>
      }
      const amount = Number(row.getValue("baseAmount") ?? 0)
      const currency = String(row.getValue("currency") ?? "EUR")
      const formatted = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(amount)
      return <div className="text-center font-medium">{formatted}</div>
    },
    size:120,
    minSize: 100,
  },
  {
    accessorKey: "currency",
    header: () => <div className="text-center">Currency</div>,
    cell: ({ row }) => {
      // В подстроках валюту не показываем
      if (row.depth === 1) {
        return <div className="text-center h-5" />
      }
      return <div className="text-center">{row.getValue("currency") as string}</div>
    },
    size:106,
    minSize: 80,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      // В подстроках нет действий
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(transaction.id)}>
              Copy transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View account details</DropdownMenuItem>
            <DropdownMenuItem>View transaction details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    size:67,
    minSize: 56,
  },
]

export function WalletTable({ data = [] }: { data?: Transaction[] }) {
    const safeData = Array.isArray(data) ? data : []

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [filterValue, setFilterValue] = useState<string>("")
    const [expanded, setExpanded] = useState<{}>({})

    const table = useReactTable({
        data: safeData,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        paginateExpandedRows: false,
        filterFromLeafRows: false,
        enableGlobalFilter: true,
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        onExpandedChange: setExpanded,
        getRowCanExpand: (row) => Array.isArray((row.original as any).entries) && (row.original as any).entries.length > 0,
        getSubRows: (row: any) => row.entries ?? [],
        globalFilterFn: (row, _columnId, value) => {
          const original: any = row.original
          const hasFilter = !!value && String(value).trim().length > 0

          if (row.depth > 0) {
            if (!hasFilter) return true

            const childId = row.id
            const parentId = childId.includes(".")
              ? childId.slice(0, childId.lastIndexOf("."))
              : ""
            if (parentId && (expanded as Record<string, boolean>)[parentId]) {
              return true
            }

            const entryText = Object.values(original)
              .filter((v) => v !== undefined && v !== null)
              .join(" ")
              .toLowerCase()
            const v = String(value).toLowerCase()
            return entryText.includes(v)
          }

          if (!hasFilter) return true

          const vRaw = String(value).trim()
          const v = vRaw.toLowerCase()

          const numberLike = /^[0-9]+([.,][0-9]+)?$/.test(vRaw)
          if (numberLike) {
            const nums: (string | number | undefined)[] = [
              original.amount,
              original.baseAmount,
            ]

            const matchSelf = nums.some((num) => {
              if (num === undefined || num === null) return false
              return String(num).replace(",", ".").includes(vRaw.replace(",", "."))
            })

            const entries = Array.isArray(original.entries) ? original.entries : []
            const matchEntry = entries.some((e: Record<string, unknown>) => {
              const ea = e.amount as string | number | undefined
              if (ea === undefined || ea === null) return false
              return String(ea).replace(",", ".").includes(vRaw.replace(",", "."))
            })

            return matchSelf || matchEntry
          }

          const fields = [
            original.executedAt,
            original.type,
            original.description,
            original.vaultId,
            original.amount,
            original.baseAmount,
            original.currency,
          ]

          const entries = Array.isArray(original.entries) ? original.entries : []
          const entriesText = entries
            .map((e: Record<string, unknown>) => Object.values(e).join(" "))
            .join(" ")
            .toLowerCase()

          return (
            fields
              .filter((f) => f !== undefined && f !== null)
              .some((f) => String(f).toLowerCase().includes(v)) ||
            entriesText.includes(v)
          )
        },
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
            globalFilter: filterValue,
            expanded,
        },
    })

    useEffect(() => {
        const t = setTimeout(() => {
            table.setGlobalFilter(filterValue)

            const visibleIds = new Set(table.getRowModel().rows.map((r) => r.id))

            setExpanded((prev) => {
                const next: Record<string, boolean> = {}
                for (const [key, isOpen] of Object.entries(prev)) {
                    if (!isOpen) continue
                    if (visibleIds.has(key)) {
                        next[key] = true
                    }
                }
                return next
            })
        }, 300)

        return () => clearTimeout(t)
    }, [filterValue])

    return (
        <div className="w-full">
            <div className="flex items-center pb-3">
                <Input
                    placeholder="Search Savora"
                    value={filterValue}
                    onChange={(event) => setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} style={{ width: header.getSize() }}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
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

"use client"

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    VisibilityState,
    PaginationState,
    useReactTable,
    Header,
    Cell,
} from "@tanstack/react-table"

import { ArrowUpDown, ChevronDown, MoreHorizontal, GripVertical } from "lucide-react"

import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    type DragEndEvent,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { restrictToHorizontalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

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

import WalletOptions from "@/src/components/wallet-options"
import { WalletTablePagination } from "@/src/components/wallet-pagination"
import { WalletSearch } from "@/src/components/wallet-search"

import { useWalletGlobalFilter } from "@/src/hooks/use-wallet-global-filter"

import { useTypeOptions } from "@/src/lib/stores/type-options-store"
import { useWallets } from "@/src/lib/stores/wallets-store"

import { Transaction, TransactionEntry } from "@/src/lib/types/transactions"

const DraggableTableHeader = ({ header }: {
    header: Header<Transaction, unknown>
}) => {
    const { setNodeRef, isDragging, transform } = useSortable({
        id: header.column.id,
    })

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform),
        transition: 'width transform 0.2s ease-in-out',
        whiteSpace: 'nowrap',
        width: header.column.getSize(),
        zIndex: isDragging ? 1 : 0,
    }

    return (
        <TableHead
            colSpan={header.colSpan}
            ref={setNodeRef}
            style={style}
            className="group relative"
        >
            {header.isPlaceholder ? null : (
                <div className="flex-1 min-w-0">
                    {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                    )}
                </div>
            )}
        </TableHead>
    )
}
const DraggableHeaderButton = ({ id }: { id: string }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id })
    const style: CSSProperties = {
        opacity: isDragging ? 0.9 : undefined,
        display: 'inline-flex',
        alignItems: 'center',
    }

    return (
        <Button
            ref={setNodeRef}
            variant="ghost"
            {...attributes}
            {...listeners}
            aria-label="Drag column"
            style={style}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
            <GripVertical className="w-4 h-4" />
        </Button>
    )
}

const DragAlongCell = ({ cell }: { cell: Cell<Transaction, unknown> }) => {
    const { isDragging, setNodeRef, transform } = useSortable({
        id: cell.column.id,
    })

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform),
        transition: 'width transform 0.2s ease-in-out',
        width: cell.column.getSize(),
        zIndex: isDragging ? 1 : 0,
    }

    return (
        <TableCell
            key={cell.id}
            style={{ ...style, touchAction: 'none', userSelect: 'none' }}
            ref={setNodeRef}
        >
            {flexRender(
                cell.column.columnDef.cell,
                cell.getContext(),
            )}
        </TableCell>
    )
}

export function WalletTable({ data = [] }: { data?: Transaction[] }) {
    const safeData = Array.isArray(data) ? data : []
    const walletFilterType = useTypeOptions(state => state.type)

    const [tableData, setTableData] = useState<Transaction[]>(safeData)

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 15,
    })

    const [searchValue, setSearchValue] = useState<string>("")
    const globalFilterFn = useWalletGlobalFilter()

    const columns = useMemo<ColumnDef<Transaction>[]>(() => [
        {
            accessorKey: "type",
            header: ({column}) => (
                <div className="flex items-center pl-4">
                    <div>Type</div>
                    <DraggableHeaderButton id={column.id}/>
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="pl-4 capitalize">{row.getValue("type")}</div>
                )
            },
            size: 150,
            minSize: 85,
            maxSize: 85,
        },
        {
            accessorKey: "baseAmount",
            header: ({ column }) => (
                <div className="flex items-center ml-1">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="pr-0 has-[>svg]:pr-0">
                        Amount
                        <ArrowUpDown className="w-4 h-4" />
                    </Button>
                    <DraggableHeaderButton id={column.id} />
                </div>
            ),
            cell: ({ row }) => {
                const amount = Number(row.getValue("baseAmount") ?? 0)
                const currency = "EUR"

                const formatted = new Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency,
                }).format(amount)// поменять местами чтоб евро было спереди

                return <div className="pl-4 font-medium">{formatted}</div>
            },
            size: 150,
            minSize: 90,
            maxSize: 90,
        },
        {
            accessorKey: "target",
            header: ({column}) => (
                <div className="flex items-center pl-4">
                    <div>Target</div>
                    <DraggableHeaderButton id={column.id}/>
                </div>
            ),
            cell: ({ row }) => {
                const entries = row.original.entries
                const VaultId = entries
                    .filter((entry: TransactionEntry) => entry.type === "debit")
                    .map((entry: TransactionEntry) => entry.vaultId.replace(/^seed_vault_/, ""))
                return (
                    <div className="pl-4">
                        {VaultId}
                    </div>
                )
            },
            size: 150,
            minSize: 100,
            maxSize: 100,
        },
        {
            accessorKey: "description",
            header: ({column}) => (
                <div className="flex items-center ml-2">
                    <div>Description</div>
                    <DraggableHeaderButton id={column.id}/>
                </div>
            ),
            cell: ({ row }) => {
                return <div className="ml-2">{row.getValue("description")}</div>
            },
            size: 250,
            minSize: 180,
        },
        {
            accessorKey: "executedAt",
            header: ({ column }) => (
                <div className="flex items-center ml-1">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="pr-0 has-[>svg]:pr-0">
                        Executed At
                        <ArrowUpDown className="w-4 h-4" />
                    </Button>
                    <DraggableHeaderButton id={column.id} />
                </div>
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue("executedAt") as string)
                return <div className="pl-4">{date.toLocaleDateString()}</div>
            },
            size: 150,
            minSize: 110,
            maxSize: 110,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const transaction = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-4 w-4 p-0 ">
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
            size: 60,
            minSize: 40,
            maxSize: 40,
        },
    ], [])

    const {columnOrder, setColumnOrder} = useWallets()

    useEffect(() => {
        if(columnOrder.length === 0) {
            setColumnOrder(columns.map((column, index) => {
                const accessor = 'accessorKey' in column ? column.accessorKey : undefined;
                return column.id ?? accessor ?? String(index)
            }))
        }
    }, []);

    useEffect(() => {
        setTableData(() =>
            walletFilterType === "all"
                ? safeData
                : safeData.filter(item => item.type === walletFilterType),
        )
    }, [safeData, walletFilterType])

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
        state: {
            columnOrder,
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
            globalFilter: searchValue,
        },
    })

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            const oldIndex = columnOrder.indexOf(String(active.id))
            const newIndex = columnOrder.indexOf(String(over.id))
            // safety: if something unexpected happens, do nothing
            if (oldIndex === -1 || newIndex === -1) return
            const newOrder = arrayMove([...columnOrder], oldIndex, newIndex)
            setColumnOrder(newOrder)
        }
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    return (
        <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
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
                                    <SortableContext
                                        items={columnOrder.filter(id => id !== "actions")}
                                        strategy={horizontalListSortingStrategy}
                                    >
                                        {headerGroup.headers
                                            .filter(header => header.id !== "actions")
                                            .map(header => (
                                                <DraggableTableHeader key={header.id} header={header} />
                                            ))}
                                    </SortableContext>

                                    {headerGroup.headers.map(header => {
                                        if (header.id === "actions") {
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    style={{
                                                        width: header.column.getSize(),
                                                        position: 'sticky',
                                                        right: 0,
                                                    }}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            )
                                        }
                                        return null
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
                                        <SortableContext
                                            items={columnOrder.filter(id => id !== "actions")}
                                            strategy={horizontalListSortingStrategy}
                                        >
                                            {row.getVisibleCells()
                                                .filter(cell => cell.column.id !== "actions")
                                                .map(cell => (
                                                    <DragAlongCell key={cell.id} cell={cell} />
                                                ))}
                                        </SortableContext>

                                        {row.getVisibleCells().map(cell => {
                                            if (cell.column.id === "actions") {
                                                return (
                                                    <TableCell
                                                        key={cell.id}
                                                        style={{
                                                            width: cell.column.getSize(),
                                                            position: 'sticky',
                                                            right: 0,
                                                        }}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                )
                                            }
                                            return null
                                        })}
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
        </DndContext>
    )
}

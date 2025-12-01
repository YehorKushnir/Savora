"use client"

import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowRightLeft, MoreHorizontal } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import LucideIcon, { IconName } from "@/src/components/lucide-icon"

import { format } from "date-fns"
import { cn } from "@/src/lib/utils"
import { TransactionWithRelations } from "@/src/lib/types/transactions"
import { useTransactions } from "@/src/lib/stores/transactions-store"
import { formatCurrency } from "@/src/lib/helpers/format-currency"

import { DraggableHeaderButton } from "@/src/components/data-table/draggable-components"

export const useTransactionColumns = () => {
    const setOpenModal = useTransactions((state) => state.setOpenModal)
    const setOpenDeleteModal = useTransactions((state) => state.setOpenDeleteModal)

    const columns = useMemo<ColumnDef<TransactionWithRelations>[]>(() => [
        {
            accessorKey: "type",
            id: "type",
            header: ({ column }) => (
                <div className="flex items-center pl-4">
                    <div>Type</div>
                    <DraggableHeaderButton id={column.id} />
                </div>
            ),
            cell: ({ row }) => (
                <div className="pl-4 capitalize">{row.getValue("type")}</div>
            ),
            size: 150,
            minSize: 100,
            maxSize: 120,
        },
        {
            id: "category",
            accessorFn: (row) => row.Category?.name || row.type,
            header: ({ column }) => (
                <div className="flex items-center gap-1">
                    <span>Category</span>
                    <DraggableHeaderButton id={column.id} />
                </div>
            ),
            cell: ({ row }) => {
                const t = row.original
                if (t.Category) {
                    return (
                        <div className="flex items-center gap-2">
                            {t.Category.icon && (
                                <div className="p-1.5 bg-secondary rounded-md">
                                    <LucideIcon name={t.Category.icon as IconName} className="w-4 h-4" />
                                </div>
                            )}
                            <span className="font-medium">{t.Category.name}</span>
                        </div>
                    )
                }
                return (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-secondary rounded-md">
                            {t.type === 'transfer' && <ArrowRightLeft className="w-4 h-4" />}
                            {t.type === 'initial' && <LucideIcon name="Landmark" className="w-4 h-4" />}
                            {t.type === 'adjustment' && <LucideIcon name="Scale" className="w-4 h-4" />}
                        </div>
                        <span className="capitalize">{t.type === 'initial' ? 'initial' : t.type}</span>
                    </div>
                )
            },
            size: 200,
            minSize: 150,
            maxSize: 150,
        },
        {
            id: "tags",
            header: ({ column }) => (
                <div className="flex items-center gap-1">
                    <span>Tags</span>
                    <DraggableHeaderButton id={column.id} />
                </div>
            ),
            cell: ({ row }) => {
                const tags = row.original.tags
                if (!tags || tags.length === 0) return null
                return (
                    <div className="flex flex-wrap gap-1">
                        {tags.map(tag => (
                            <Badge key={tag.id} variant="outline" className="text-xs font-normal">
                                #{tag.name}
                            </Badge>
                        ))}
                    </div>
                )
            },
            size: 180,
            minSize: 100,
            maxSize: 100
        },
        {
            id: "amount",
            accessorFn: (row) => row.entries[0]?.amount || 0,
            header: ({ column }) => (
                <div className="flex items-center ml-1">
                    <span>Amount</span>
                    <DraggableHeaderButton id={column.id} />
                </div>
            ),
            cell: ({ row }) => {
                const t = row.original
                const entry = t.entries[0]
                const amount = entry ? Number(entry.amount) : 0
                const isExpense = t.type === 'expense'
                const isIncome = t.type === 'income'

                return (
                    <div className={cn(
                        "font-medium",
                        isIncome && "text-emerald-600",
                        isExpense && "text-red-600",
                    )}>
                        {isExpense ? "-" : isIncome ? "+" : ""}
                        {formatCurrency(Math.abs(amount), t.currency)}
                    </div>
                )
            },
            size: 110,
            minSize: 100,
        },
        {
            accessorKey: "description",
            id: "description",
            header: ({ column }) => (
                <div className="flex items-center ml-2">
                    <div>Description</div>
                    <DraggableHeaderButton id={column.id} />
                </div>
            ),
            cell: ({ row }) => (
                <div className="ml-2 truncate max-w-[200px]">{row.getValue("description")}</div>
            ),
            size: 250,
            minSize: 150,
        },
        {
            accessorKey: "executedAt",
            id: "executedAt",
            header: ({ column }) => (
                <div className="flex items-center gap-1">
                    <span>Date</span>
                    <DraggableHeaderButton id={column.id} />
                </div>
            ),
            cell: ({ row }) => {
                const dateVal = row.getValue("executedAt");
                if (!dateVal) return null;
                return <div className="text-muted-foreground text-sm">
                    {format(new Date(row.original.executedAt), "dd MMM yyyy")}
                </div>
            },
            size: 110,
            minSize: 100,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const isOpeningBalance = row.original.type === 'initial' || row.original.type === 'adjustment'
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-4 w-4 p-0"
                                disabled={isOpeningBalance}>
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setOpenModal(true, row.original)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setOpenDeleteModal(true, row.original)}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
            size: 60,
            minSize: 30,
            maxSize: 30,
        },
    ], [setOpenModal, setOpenDeleteModal])

    return columns
}
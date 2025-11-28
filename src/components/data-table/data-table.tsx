"use client"

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
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { Table as ReactTable, flexRender } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { TablePagination } from "@/src/components/table-pagination"
import { DraggableTableHeader, DragAlongCell } from "./draggable-components"
import { ReactNode } from "react"

interface DataTableProps<TData> {
    table: ReactTable<TData>
    columnOrder: string[]
    setColumnOrder: (order: string[]) => void
    children?: ReactNode
}

export function DataTable<TData>({ table, columnOrder, setColumnOrder, children }: DataTableProps<TData>) {

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            const oldIndex = columnOrder.indexOf(String(active.id))
            const newIndex = columnOrder.indexOf(String(over.id))

            const newOrder = arrayMove(columnOrder, oldIndex, newIndex)

            setColumnOrder(newOrder)
        }
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    // Стили для фиксированной колонки Actions
    const stickyStyles = {
        position: 'sticky' as const,
        right: 0,
        backgroundColor: 'hsl(var(--background))',
    }

    return (
        <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <div className="w-full space-y-4">
                {children}

                <div className="overflow-hidden rounded-md border">
                    <Table className="table-fixed w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    <SortableContext
                                        items={columnOrder.filter(id => id !== "actions")}
                                        strategy={horizontalListSortingStrategy}
                                    >
                                        {headerGroup.headers.map(header => {
                                            if (header.id === "actions") {
                                                return (
                                                    <TableHead
                                                        key={header.id}
                                                        colSpan={header.colSpan}
                                                        style={{
                                                            width: header.column.getSize(),
                                                            zIndex: 20,
                                                            ...stickyStyles
                                                        }}
                                                    >
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </TableHead>
                                                )
                                            }
                                            return <DraggableTableHeader key={header.id} header={header} />
                                        })}
                                    </SortableContext>
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
                                            {row.getVisibleCells().map(cell => {
                                                // Рендер Sticky Actions Cell
                                                if (cell.column.id === "actions") {
                                                    return (
                                                        <TableCell
                                                            key={cell.id}
                                                            style={{
                                                                width: cell.column.getSize(),
                                                                zIndex: 10,
                                                                ...stickyStyles
                                                            }}
                                                        >
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    )
                                                }
                                                return <DragAlongCell key={cell.id} cell={cell} />
                                            })}
                                        </SortableContext>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columnOrder.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <TablePagination table={table} />
            </div>
        </DndContext>
    )
}
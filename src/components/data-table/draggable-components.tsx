"use client"

import { CSSProperties } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Header, Cell, flexRender } from "@tanstack/react-table"
import { TableHead, TableCell } from "@/src/components/ui/table"
import { Button } from "@/src/components/ui/button"
import { GripVertical } from "lucide-react"

export const DraggableTableHeader = <TData,>({ header }: { header: Header<TData, unknown> }) => {
    const {isDragging,setNodeRef, transform } = useSortable({
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

export const DraggableHeaderButton = ({ id }: { id: string }) => {
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

export const DragAlongCell = <TData,>({ cell }: { cell: Cell<TData, unknown> }) => {
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
            style={{ ...style, touchAction: 'none' }}
            ref={setNodeRef}
        >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
    )
}
"use client"

import {
    ColumnDef,
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {ChevronDown, ChevronRight, MoreHorizontal} from "lucide-react"

import {Button} from "@/src/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import {use, useEffect, useState} from "react"
import LucideIcon, {IconName} from "@/src/components/lucide-icon"
import {CategoryWithSubs} from "@/src/app/(dashboard)/categories/actions"
import {useCategories} from "@/src/lib/stores/categories-store"
import { TabsList, Tabs, TabsTrigger } from "@/src/components/ui/tabs"

type RowNode = {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    icon: string
    type: string
    categoryId: string
    subcategories: RowNode[]
}

export const columns: ColumnDef<RowNode>[] = [
    {
        id: "expander",
        header: "",
        cell: ({row}) =>
            row.getCanExpand() ? (
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={row.getToggleExpandedHandler()}
                >
                    {row.getIsExpanded() ? <ChevronDown/> : <ChevronRight/>}
                </Button>
            ) : null,
        enableSorting: false,
        enableHiding: false,
        size: 48,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({row}) => (
            <div className={`flex items-center gap-3 ${row.depth === 1 ? "pl-9" : ""}`}>
                {"icon" in row.original && (
                    <LucideIcon name={row.original.icon as IconName}/>
                )}
                {row.getValue("name")}
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        size: 48,
        cell: ({row}) => {
            const setOpenModal = useCategories((state) => state.setOpenModal)
            const setOpenDeleteModal = useCategories((state) => state.setOpenDeleteModal)
            const setOpenSubcategoryModal = useCategories((state) => state.setOpenSubcategoryModal)
            const setOpenSubcategoryDeleteModal = useCategories((state) => state.setOpenSubcategoryDeleteModal)

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {row.depth === 0 ? (
                            <>
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (row.original.icon) {
                                            setOpenModal(true, row.original)
                                        }
                                    }}
                                >
                                    Edit category
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setOpenSubcategoryModal(true, row.original.id)}
                                >
                                    Add subcategory
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => setOpenDeleteModal(true, row.original)}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <>
                                <DropdownMenuItem
                                    onClick={() => setOpenSubcategoryModal(true, row.original.id, row.original)}
                                >
                                    Edit subcategory
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                        setOpenSubcategoryDeleteModal(true, row.original)
                                    }
                                >
                                    Delete
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

interface Props {
    categories: Promise<CategoryWithSubs[]>
}

export default function CategoryTable(props: Props) {
    const data = use(props.categories)
    const [rows, setRows] = useState([...data])
    const setOpenModal = useCategories((state) => state.setOpenModal)
    const [expanded, setExpanded] = useState<ExpandedState>({})
    const [type, setType] = useState('all')

    const table = useReactTable({
        data: rows as RowNode[],
        columns,
        state: {expanded},
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSubRows: (row) => row.subcategories,
    })

    useEffect(() => {
        setRows(() => type === 'all' ? data : data.filter((item) => item.type === type))
    }, [data])

    const handleChangeType = (type: string) => {
        setType(type)
        setRows(() => type === 'all' ? data : data.filter((item) => item.type === type))
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <div className={'w-full flex justify-between'}>
                <Tabs value={type} onValueChange={handleChangeType}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="income">Incomes</TabsTrigger>
                        <TabsTrigger value="expense">Expenses</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Button onClick={() => setOpenModal(true)}>
                    Add category
                </Button>
            </div>
            <div className="max-h-[500px] relative overflow-auto rounded-md border">
                <Table className="border-collapse">
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id} className={'sticky top-0 hover:bg-background bg-background z-10 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-border'}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={
                                                cell.column.id === "actions" ||
                                                cell.column.id === "expander"
                                                    ? "w-12"
                                                    : ""
                                            }
                                        >
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
        </div>
    )
}
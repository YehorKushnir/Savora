"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"
import {Button} from "@/src/components/ui/button"
import {use, useEffect, useState, useMemo} from "react"
import LucideIcon, {IconName} from "@/src/components/lucide-icon"
import {useCategories} from "@/src/lib/stores/categories-store"
import {ClientCategory} from "@/src/app/[locale]/(dashboard)/categories/actions";
import {MoreHorizontal} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu";
import { useTranslations } from 'next-intl';

interface Props {
    categories: Promise<ClientCategory[]>
}

export default function CategoryTable(props: Props) {
    const data = use(props.categories)
    const [rows, setRows] = useState([...data])
    const type = useCategories((state) => state.type)
    const searchValue = useCategories((state) => state.searchValue)

    const t = useTranslations('Categories');

    const columns: ColumnDef<ClientCategory>[] = useMemo(() => [
        {
            accessorKey: "name",
            header: t('table.name'),
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
                const setOpenModal = useCategories.getState().setOpenModal
                const setOpenDeleteModal = useCategories.getState().setOpenDeleteModal
                const categories = row.original

                const category = {
                    id: categories.id,
                    name: categories.name,
                    icon: categories.icon,
                    type: categories.type as 'income' | 'expense'
                }

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => setOpenModal(true, category)}
                            >
                                {t('actions.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setOpenDeleteModal(true, category)}
                            >
                                {t('actions.delete')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )},
        },
    ], [t])

    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    useEffect(() => {
        let filteredData = type === 'all' ? data : data.filter((item) => item.type === type);

        if (searchValue) {
            const lowerSearch = searchValue.toLowerCase();
            filteredData = filteredData.filter((item) =>
                item.name.toLowerCase().includes(lowerSearch)
            );
        }

        setRows(filteredData);
    }, [data, type, searchValue])

    return (
        <div className="max-h-[500px] relative overflow-auto rounded-md border">
            <Table className="border-collapse">
                <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                        <TableRow key={hg.id}
                                  className={'sticky top-0 hover:bg-background bg-background z-10 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-border'}>
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
                                {t('table.no_results')}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
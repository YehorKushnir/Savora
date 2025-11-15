import {Table as ReactTableInstance} from "@tanstack/react-table"
import {Button} from "@/src/components/ui/button";
import {FC} from "react";

interface Props {
  table: ReactTableInstance<any>
}

export const WalletTablePagination: FC<Props> = ({ table }) => {
    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-4 flex-row flex items-center">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        «
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        »
                    </Button>
                </div>
                <span className="text-md align-center">
                    {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
                </span>
                <label className="text-sm">
                    Rows per page:{' '}
                    <select
                        className="ml-2 border rounded px-2 py-1 bg-background"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                    >
                        {[15, 20, 30, 50].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    )
}
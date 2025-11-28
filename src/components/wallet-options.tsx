import {SavoraSearch} from "@/src/components/savora-search";
import {TableOptions} from "@/src/components/table-options";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu";
import {Button} from "@/src/components/ui/button";
import {ChevronDown} from "lucide-react";
import {Table as ReactTableInstance} from "@tanstack/react-table";
import {useTypeOptions} from "@/src/lib/stores/type-options-store";

interface Props {
    table: ReactTableInstance<any>
}

export const WalletOptions = ({table}: Props) => {
    const searchValue = useTypeOptions(state => state.searchValue)
    const setSearchValue = useTypeOptions(state => state.setSearchValue)

    return (
        <div className="flex items-center gap-4 justify-between">
            <SavoraSearch
                value={searchValue}
                onChangeAction={setSearchValue}
            />
            <div className="flex items-center gap-4">
                <TableOptions />
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
    )
}
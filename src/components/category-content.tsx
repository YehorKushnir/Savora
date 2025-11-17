"use client"

import {useCategories} from "@/src/lib/stores/categories-store";
import CategoryTable from "@/src/components/category-table";
import {CategoryCard} from "@/src/components/category-card";
import {ClientVault} from "@/src/app/(dashboard)/categories/actions";

interface Props {
    categories: Promise<ClientVault[]>
}

export const CategoryContent = (props: Props) => {
    const appearance = useCategories((state) => state.appearance)

    return (
        <>
            {appearance === 'table'
                ?<CategoryTable categories={props.categories}/>
                :<CategoryCard categories={props.categories}/>
            }
        </>
    )
}
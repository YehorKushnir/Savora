"use client"

import {use, useEffect, useState} from "react";
import {useCategories} from "@/src/lib/stores/categories-store";
import {Card, CardDescription, CardHeader, CardTitle} from "@/src/components/ui/card";
import LucideIcon, {IconName} from "@/src/components/lucide-icon";
import {ContextMenu, ContextMenuContent, ContextMenuTrigger, ContextMenuItem} from '@/src/components/ui/context-menu'
import {ClientVault} from "@/src/app/(dashboard)/categories/actions";
import {getCurrencySymbol} from "@/src/lib/get-currency-symol";

interface Props {
    categories: Promise<ClientVault[]>
}

export const CategoryCard = (props: Props) => {
    const data = use(props.categories)
    const [card, setCard] = useState([...data])
    const type = useCategories((state) => state.type)
    const setOpenModal = useCategories((state) => state.setOpenModal)
    const setOpenDeleteModal = useCategories((state) => state.setOpenDeleteModal)

    console.log(card)

    const typeConversion = (categories: ClientVault)=> {
        return {
            id: categories.id,
            name: categories.name,
            icon: categories.icon,
            type: categories.type as 'income' | 'expense'
        }
    }

    useEffect(() => {
        setCard(() => type === 'all' ? data : data.filter((item) => item.type === type))
    }, [data, type])

    return (
        <div className="grid grid-cols-4 gap-4">
            { card.map((item) => (
                <ContextMenu key={item.id}>
                    <ContextMenuTrigger className={'w-full'}>
                        <Card
                            className={`w-full flex flex-row gap-4 items-center py-2 px-4 rounded-md cursor-pointer`}
                        >
                            <LucideIcon name={item.icon as IconName} size={40}/>
                            <CardHeader className={'w-full p-0'}>
                                <CardTitle className={'flex'}>{item.name}</CardTitle>
                                <CardDescription>{getCurrencySymbol(item.currency)} {`${item.balance}`}</CardDescription>
                            </CardHeader>
                        </Card>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem onClick={() => setOpenModal(true, typeConversion(item))}>
                            Edit category
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() => setOpenDeleteModal(true, typeConversion(item))}
                        >
                            Delete
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            ))}
        </div>
    )
}
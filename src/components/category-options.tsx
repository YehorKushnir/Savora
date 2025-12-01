'use client'

import {useCategories} from '@/src/lib/stores/categories-store'
import {Tabs, TabsList, TabsTrigger} from '@/src/components/ui/tabs'
import {Button} from '@/src/components/ui/button'
import {SavoraSearch} from "@/src/components/savora-search";

const CategoryOptions = () => {
    const setOpenModal = useCategories((state) => state.setOpenModal)
    const type = useCategories((state) => state.type)
    const setType = useCategories((state) => state.setType)
    const appearance = useCategories((state) => state.appearance)
    const setAppearance = useCategories((state) => state.setAppearance)
    const searchValue = useCategories((state) => state.searchValue)
    const setSearchValue = useCategories((state) => state.setSearchValue)

    return (
        <div className={'w-full flex justify-between'}>
            <div className="flex gap-4">
                <Button onClick={() => setOpenModal(true)}>
                    Add category
                </Button>
                <Tabs value={type} onValueChange={setType}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="income">Incomes</TabsTrigger>
                        <TabsTrigger value="expense">Expenses</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Tabs value={appearance} onValueChange={setAppearance}>
                    <TabsList>
                        <TabsTrigger value="table">Table</TabsTrigger>
                        <TabsTrigger value="card">Card</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <SavoraSearch onChangeAction={setSearchValue} value={searchValue} className="w-[384px]"/>
        </div>
    )
}

export default CategoryOptions
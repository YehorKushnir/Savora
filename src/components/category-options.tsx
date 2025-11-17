'use client'

import {useCategories} from '@/src/lib/stores/categories-store'
import {Tabs, TabsList, TabsTrigger} from '@/src/components/ui/tabs'
import {Button} from '@/src/components/ui/button'

const CategoryOptions = () => {
    const setOpenModal = useCategories((state) => state.setOpenModal)
    const type = useCategories((state) => state.type)
    const setType = useCategories((state) => state.setType)
    const appearance = useCategories((state) => state.appearance)
    const setAppearance = useCategories((state) => state.setAppearance)

    return (
        <div className={'w-full flex justify-between'}>
            <Tabs value={type} onValueChange={setType}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="income">Incomes</TabsTrigger>
                    <TabsTrigger value="expense">Expenses</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="flex gap-4">
                <Tabs value={appearance} onValueChange={setAppearance}>
                    <TabsList>
                        <TabsTrigger value="table">Table</TabsTrigger>
                        <TabsTrigger value="card">Card</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Button onClick={() => setOpenModal(true)}>
                    Add category
                </Button>
            </div>
        </div>
    )
}

export default CategoryOptions
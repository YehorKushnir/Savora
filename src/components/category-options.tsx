'use client'

import {useCategories} from '@/src/lib/stores/categories-store'
import {Tabs, TabsList, TabsTrigger} from '@/src/components/ui/tabs'
import {Button} from '@/src/components/ui/button'

const CategoryOptions = () => {
    const setOpenModal = useCategories((state) => state.setOpenModal)
    const type = useCategories((state) => state.type)
    const setType = useCategories((state) => state.setType)

    return (
        <div className={'w-full flex justify-between'}>
            <Tabs value={type} onValueChange={setType}>
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
    )
}

export default CategoryOptions
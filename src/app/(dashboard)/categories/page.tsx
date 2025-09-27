import CategoryModal from '@/src/components/category-modal'
import CategoryDeleteModal from '@/src/components/category-delete-modal'
import CategoryTable from '@/src/components/category-table'
import {getCategories} from '@/src/app/(dashboard)/categories/actions'
import SubcategoryModal from '@/src/components/subcategory-modal'
import {Suspense} from 'react'
import {Skeleton} from '@/src/components/ui/skeleton'
import CategoryOptions from '@/src/components/category-options'
import SubcategoryDeleteModal from '@/src/components/subcategory-delete-modal'

export default function Transactions() {
    const categories = getCategories()

    return (
        <div className={'w-full flex'}>
            <div className={'w-full flex flex-col items-center'}>
                <CategoryModal/>
                <CategoryDeleteModal/>
                <SubcategoryModal/>
                <SubcategoryDeleteModal/>
                <div className="w-full flex flex-col gap-4">
                    <CategoryOptions/>
                    <Suspense fallback={<Skeleton className={'w-full h-[500px]'}/>}>
                        <CategoryTable categories={categories}/>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
import CategoryModal from '@/src/components/category-modal'
import CategoryDeleteModal from '@/src/components/category-delete-modal'
import {getCategories} from '@/src/app/(dashboard)/categories/actions'
import {Suspense} from 'react'
import {Skeleton} from '@/src/components/ui/skeleton'
import CategoryOptions from '@/src/components/category-options'
import {CategoryContent} from "@/src/components/category-content";

export default function Transactions() {
    const categories = getCategories()

    return (
        <div className={'w-full flex'}>
            <div className={'w-full flex flex-col items-center'}>
                <CategoryModal/>
                <CategoryDeleteModal/>
                <div className="w-full flex flex-col gap-4">
                    <CategoryOptions/>
                    <Suspense fallback={<Skeleton className={'w-full h-[500px]'}/>}>
                        <CategoryContent categories={categories}/>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
import CategoryModal from '@/src/components/category-modal'
import CategoryDeleteModal from '@/src/components/category-delete-modal'
import CategoryTable from '@/src/components/category-table'
import {getCategories} from '@/src/app/(dashboard)/categories/actions'
import SubcategoryModal from '@/src/components/subcategory-modal'

export default function Transactions() {
    const categories = getCategories()

    return (
        <div className={'w-full flex'}>
            <div className={'w-full flex flex-col items-center'}>
                <CategoryModal/>
                <CategoryDeleteModal/>
                <SubcategoryModal/>
                <CategoryDeleteModal/>
                <CategoryTable categories={categories} />
            </div>
        </div>
    )
}
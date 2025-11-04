import {CategoryCreateUpdateType} from '@/src/lib/types/category-create-update-type'

export function categoryDto (data: CategoryCreateUpdateType) {
    return {
        name: data.name,
        icon: data.icon,
        type: data.type
    }
}
import {CategoryCreateUpdateType} from '@/src/lib/types/category-create-update-type'

export function categoryCreateDto (data: CategoryCreateUpdateType) {
    return {
        name: data.name,
        icon: data.icon,
        type: data.type
    }
}
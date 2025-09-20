'use server'

import {prisma} from '@/prisma'
import {revalidateTag, unstable_cache} from 'next/cache'
import {z} from 'zod'
import {categorySchema} from '@/src/components/category-modal'
import {subcategorySchema} from '@/src/components/subcategory-modal'
import { Prisma } from '@prisma/client'

export type CategoryWithSubs = Prisma.CategoryGetPayload<{
    include: { subcategories: true }
}>

export const getCategories = unstable_cache(
    async (): Promise<CategoryWithSubs[]> => prisma.category.findMany({
        orderBy: {name: 'asc'},
        include: {
            subcategories: true
        }
    }),
    ['categories'],
    {tags: ['categories']}
)

export async function createCategory(data: z.infer<typeof categorySchema>) {
    await prisma.category.create({data})
    revalidateTag('categories')
}

export async function updateCategory(id: string, data: z.infer<typeof categorySchema>) {
    await prisma.category.update({where: {id}, data})
    revalidateTag('categories')
}

export async function deleteCategory(id: string) {
    await prisma.category.delete({where: {id}})
    revalidateTag('categories')
}

export async function createSubcategory(categoryId: string, data: z.infer<typeof subcategorySchema>) {
    await prisma.subcategory.create({data: {categoryId, ...data}})
    revalidateTag('categories')
}

export async function updateSubcategory(id: string, data: z.infer<typeof subcategorySchema>) {
    await prisma.subcategory.update({where: {id}, data})
    revalidateTag('categories')
}

export async function deleteSubcategory(id: string) {
    await prisma.subcategory.delete({where: {id}})
    revalidateTag('categories')
}
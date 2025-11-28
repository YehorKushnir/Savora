'use server'

import {prisma} from '@/prisma'
import {auth} from "@/auth"
import {CategoryCreateUpdateType} from '@/src/lib/types/category-create-update-type'
import {Category} from '@prisma/client'
import {revalidatePath} from 'next/cache'

export type ClientCategory = Category

export const getCategories = async (): Promise<ClientCategory[]> => {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    const categories = await prisma.category.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return categories
}

export async function createCategory(payload: CategoryCreateUpdateType) {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    await prisma.category.create({
        data: {
            name: payload.name,
            type: payload.type,
            icon: payload.icon,
            userId
        },
    })

    revalidatePath('categories')
}

export async function updateCategory(id: string, payload: CategoryCreateUpdateType) {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    await prisma.category.update({
        where: {id},
        data: {
            name: payload.name,
            type: payload.type,
            icon: payload.icon
        },
    })

    revalidatePath('categories')
}

export async function deleteCategory(id: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthorized')

    const category = await prisma.category.findUnique({
        where: {id},
        include: {transactions: true}
    })

    if (!category) throw new Error('Category not found')

    if (category.transactions.length > 0) throw new Error('Category cannot be deleted because it has related transactions')

    await prisma.category.delete({where: {id}})
    revalidatePath('categories')
}
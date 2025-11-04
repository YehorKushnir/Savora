'use server'

import {prisma} from '@/prisma'
import {auth} from "@/auth"
import {CategoryCreateUpdateType} from '@/src/lib/types/category-create-update-type'
import {Vault} from '@prisma/client'
import {revalidatePath} from 'next/cache'

export type ClientVault = Omit<Vault, 'balance'> & {
    balance: number
}

export const getCategories = async (): Promise<ClientVault[]> => {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    const categories = await prisma.vault.findMany({
        where: {
            userId,
            type: {
                in: ['income', 'expense']
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return categories.map(category => ({
        ...category,
        balance: category.balance.toNumber()
    }))
}

export async function createCategory(payload: CategoryCreateUpdateType) {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    const user = await prisma.user.findUnique({
        where: {id: userId}
    })

    if (!user) throw new Error('User not found')

    await prisma.vault.create({
        data: {
            name: payload.name,
            type: payload.type,
            icon: payload.icon,
            currency: user.currency,
            userId
        },
    })

    revalidatePath('categories')
}

export async function updateCategory(id: string, payload: CategoryCreateUpdateType) {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    await prisma.vault.update({
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

    const vault = await prisma.vault.findUnique({where: {id}, include: {entries: true}})

    if (!vault) throw new Error('Category not found')

    if (vault.entries.length > 0) throw new Error('Category cannot be deleted')

    await prisma.vault.delete({where: {id}})
    revalidatePath('categories')
}
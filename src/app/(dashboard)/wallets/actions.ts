'use server'

import {prisma} from '@/prisma'
import {Prisma} from '@prisma/client'
import {revalidateTag, unstable_cache} from 'next/cache'
import {auth} from "@/auth";

export const getWallets = unstable_cache(
    async () => prisma.vault.findMany({
        where: {type: 'asset'},
        orderBy: {name: 'asc'}
    }),
    ['wallets'],
    {tags: ['wallets']}
)

export async function createWallet(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthorized')

    const name = String(formData.get('name'))
    const balance = String(formData.get('balance'))
    const icon = String(formData.get('icon'))
    const currency = String(formData.get('currency'))

    await prisma.vault.create({
        data: {
            name,
            type: 'asset',
            icon,
            currency,
            balance: new Prisma.Decimal(balance === '' ? 0 : balance),
            userId: session.user.id,
        }
    })
    revalidateTag('wallets')
}

export async function updateWallet(formData: FormData) {
    const id = String(formData.get('id'))
    const name = String(formData.get('name'))
    const balance = String(formData.get('balance'))
    const icon = String(formData.get('icon'))
    const currency = String(formData.get('currency'))

    await prisma.vault.update({
        where: {id},
        data: {
            name,
            icon,
            currency,
            balance: new Prisma.Decimal(balance === '' ? 0 : balance),
        }
    })
    revalidateTag('wallets')
}

export async function deleteWallet(id: string) {
    await prisma.vault.delete({where: {id}})
    revalidateTag('wallets')
}
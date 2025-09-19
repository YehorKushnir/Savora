'use server'

import {prisma} from '@/prisma'
import {Prisma} from '@prisma/client'
import {revalidateTag, unstable_cache} from 'next/cache'

export const getWallets = unstable_cache(
    async () => prisma.wallet.findMany({orderBy: {name: 'asc'}}),
    ['wallets'],
    {tags: ['wallets']}
)

export async function createWallet(formData: FormData) {
    const name = String(formData.get('name'))
    const type = String(formData.get('type'))
    const balance = String(formData.get('balance'))
    const icon = String(formData.get('icon'))
    const currency = String(formData.get('currency'))

    await prisma.wallet.create({
        data: {
            name,
            type,
            icon,
            currency,
            balance: new Prisma.Decimal(balance === '' ? 0 : balance),
        }
    })
    revalidateTag('wallets')
}

export async function updateWallet(formData: FormData) {
    const id = String(formData.get('id'))
    const name = String(formData.get('name'))
    const type = String(formData.get('type'))
    const balance = String(formData.get('balance'))
    const icon = String(formData.get('icon'))
    const currency = String(formData.get('currency'))

    await prisma.wallet.update({
        where: {id},
        data: {
            name,
            type,
            icon,
            currency,
            balance: new Prisma.Decimal(balance === '' ? 0 : balance),
        }
    })
    revalidateTag('wallets')
}

export async function deleteWallet(id: string) {
    await prisma.wallet.delete({where: {id}})
    revalidateTag('wallets')
}
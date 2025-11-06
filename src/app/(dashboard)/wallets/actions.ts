'use server'

import {prisma} from '@/prisma'
import {Prisma} from '@prisma/client'
import {auth} from "@/auth"
import {WalletCreateType} from '@/src/lib/types/wallet-create-type'
import {WalletUpdateType} from '@/src/lib/types/wallet-update-type'
import {createTransaction} from '@/src/app/(dashboard)/transactions/actions'
import {revalidatePath} from 'next/cache'

export const getWallets = async () => {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    const wallets = await prisma.vault.findMany({
        where: {
            userId,
            type: {
                in: ['asset', 'liability']
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return wallets.map(wallet => ({
        ...wallet,
        balance: wallet.balance.toString(),
        type: wallet.type as 'asset' | 'liability',
    }))
}

export async function createWallet(payload: WalletCreateType) {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    await prisma.$transaction(async (tx) => {
        const vault = await tx.vault.create({
            data: {
                name: payload.name,
                type: payload.type,
                icon: payload.icon,
                currency: payload.currency,
                userId,
            },
        })

        const balance = new Prisma.Decimal(payload.balance === '' ? 0 : payload.balance)

        if (balance.gt(0)) {
            const equity = await tx.vault.findFirstOrThrow({
                where: {userId, type: 'equity'},
            })

            await createTransaction({
                type: 'adjustment',
                description: `Initial balance for ${vault.name}`,
                amount: payload.balance,
                targetVaultId: vault.id,
                sourceVaultId: equity.id,
                executedAt: new Date(),
                tagIds: [],
            }, tx)
        }
    })
    revalidatePath('wallets')
}

export async function updateWallet(id: string, payload: WalletUpdateType) {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    await prisma.$transaction(async (tx) => {
        await tx.vault.update({
            where: {id},
            data: {
                name: payload.name,
                icon: payload.icon,
                balance: new Prisma.Decimal(payload.balance === '' ? 0 : payload.balance),
            }
        })

        const balance = new Prisma.Decimal(payload.balance === '' ? 0 : payload.balance)

        if (balance.gt(0)) {
            const equity = await tx.vault.findFirstOrThrow({
                where: {userId, type: 'equity'},
            })

            await createTransaction({
                type: 'adjustment',
                description: `Update balance for ${payload.name}`,
                amount: payload.balance,
                targetVaultId: id,
                sourceVaultId: equity.id,
                executedAt: new Date(),
                tagIds: [],
            }, tx)
        }
    })
    revalidatePath('wallets')
}

export async function deleteWallet(id: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthorized')

    const vault = await prisma.vault.findUnique({where: {id}, include: {entries: true}})

    if (!vault) throw new Error('Wallet not found')

    if (vault.entries.length > 0) throw new Error('Wallet cannot be deleted')

    await prisma.vault.delete({where: {id}})
    revalidatePath('wallets')
}
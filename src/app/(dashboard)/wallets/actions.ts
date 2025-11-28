'use server'

import {prisma} from '@/prisma'
import {Prisma} from '@prisma/client'
import {auth} from "@/auth"
import {WalletCreateType} from '@/src/lib/types/wallet-create-type'
import {WalletUpdateType} from '@/src/lib/types/wallet-update-type'
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
                balance: payload.balance,
                userId,
            },
        })

        const initialBalance = Number(payload.balance)

        if (initialBalance !== 0) {
            await tx.transaction.create({
                data: {
                    userId,
                    type: 'openingBalance',
                    executedAt: new Date(),
                    currency: payload.currency,
                    entries: {
                        create: {
                            vaultId: vault.id,
                            amount: initialBalance,
                            currency: payload.currency,
                            type: initialBalance > 0 ? 'debit' : 'credit',
                            balanceBefore: 0,
                            balanceAfter: initialBalance,
                        }
                    }
                }
            })
        }
    })
    revalidatePath('wallets')
}

export async function updateWallet(id: string, payload: WalletUpdateType) {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    await prisma.$transaction(async (tx) => {
        const currentVault = await tx.vault.findUniqueOrThrow({
            where: { id, userId }
        })

        const oldBalance = currentVault.balance
        const newBalance = new Prisma.Decimal(payload.balance === '' ? 0 : payload.balance)

        const diff = newBalance.minus(oldBalance)

        await tx.vault.update({
            where: { id },
            data: {
                name: payload.name,
                icon: payload.icon,
                balance: newBalance,
            }
        })

        if (!diff.equals(0)) {
            await tx.transaction.create({
                data: {
                    userId,
                    type: 'adjustment',
                    executedAt: new Date(),
                    currency: currentVault.currency,
                    description: `Manual balance adjustment`,
                    entries: {
                        create: {
                            vaultId: id,
                            amount: diff.abs(),
                            currency: currentVault.currency,
                            type: diff.isPositive() ? 'debit' : 'credit',
                            balanceBefore: oldBalance,
                            balanceAfter: newBalance,
                        }
                    }
                }
            })
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
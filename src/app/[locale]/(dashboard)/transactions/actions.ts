'use server'

import {prisma} from '@/prisma'
import {Prisma} from '@prisma/client'
import {auth} from '@/auth'
import {TransactionCreateUpdateType} from '@/src/lib/types/transaction-create-update-type'
import {createEntries} from '@/src/lib/helpers/create-entries'
import {restoreVaultBalances} from '@/src/lib/helpers/restore-vault-balances'
import {revalidatePath} from 'next/cache'
import { TransactionWithRelations } from "@/src/lib/types/transactions"

export const getTransactions = async (): Promise<TransactionWithRelations[]> => {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
        },
        include: {
            entries: true,
            tags: true,
            Category: true
        },
        orderBy: {
            executedAt: 'desc'
        }
    })

    return transactions.map((t) => ({
        ...t,
        baseAmount: t.baseAmount ? t.baseAmount.toNumber() : null,
        exchangeRate: t.exchangeRate ? t.exchangeRate.toNumber() : null,

        entries: t.entries.map((e) => ({
            ...e,
            amount: e.amount.toNumber(),
            amountBase: e.amountBase ? e.amountBase.toNumber() : null,
            balanceBefore: e.balanceBefore.toNumber(),
            balanceAfter: e.balanceAfter.toNumber(),
            exchangeRate: e.exchangeRate ? e.exchangeRate.toNumber() : null,
        }))
    })) as unknown as TransactionWithRelations[]
}

export const createTransaction = async (payload: TransactionCreateUpdateType, tx?: Prisma.TransactionClient) => {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    if (!payload.amount || Number(payload.amount) <= 0) {
        throw new Error('Amount must be positive')
    }
    const amount = new Prisma.Decimal(payload.amount)

    const run = async (db: Prisma.TransactionClient) => {
        const sourceVault = await db.vault.findUniqueOrThrow({
            where: { id: payload.sourceVaultId }
        })

        let tagConnect = undefined
        if (payload.tagName && payload.tagName.trim() !== '') {
            tagConnect = {
                connectOrCreate: {
                    where: {
                        name_userId: {
                            name: payload.tagName,
                            userId
                        }
                    },
                    create: { name: payload.tagName, userId }
                }
            }
        }

        const transaction = await db.transaction.create({
            data: {
                userId,
                type: payload.type,
                description: payload.description || null,
                executedAt: payload.executedAt || new Date(),
                currency: sourceVault.currency,
                categoryId: payload.categoryId || null,

                // TODO: В будущем здесь нужно умножать на курс валют (exchangeRate)
                baseAmount: amount,

                tags: tagConnect ? { connectOrCreate: [tagConnect.connectOrCreate] } : undefined
            },
        })

        await createEntries(db, transaction.id, payload.sourceVaultId, payload.targetVaultId, amount)
    }

    tx ? await run(tx) : await prisma.$transaction(run)

    revalidatePath('transactions')
}

export const updateTransaction = async (id: string, payload: TransactionCreateUpdateType) => {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    const amount = new Prisma.Decimal(payload.amount)

    await prisma.$transaction(async (tx) => {
        const existing = await tx.transaction.findUnique({
            where: {id},
            include: {entries: true},
        })
        if (!existing) throw new Error('Transaction not found')

        await restoreVaultBalances(tx, existing.entries, id)

        let tagsUpdate = undefined
        if (payload.tagName) {
            tagsUpdate = {
                set: [],
                connectOrCreate: [{
                    where: {
                        name_userId: {
                            name: payload.tagName,
                            userId
                        }
                    },
                    create: { name: payload.tagName, userId }
                }]
            }
        }

        const updated = await tx.transaction.update({
            where: {id},
            data: {
                type: payload.type,
                description: payload.description,
                executedAt: payload.executedAt,
                categoryId: payload.categoryId,
                tags: tagsUpdate,
                baseAmount: amount,
            },
        })

        await createEntries(tx, updated.id, payload.sourceVaultId, payload.targetVaultId, amount)
        revalidatePath('transactions')
    })
}

export const deleteTransaction = async (id: string) => {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    await prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.findUnique({
            where: {id},
            include: {entries: true},
        })

        if (!transaction) throw new Error('Transaction not found')
        if (transaction.userId !== userId) throw new Error('Forbidden')

        await restoreVaultBalances(tx, transaction.entries, id)
        await tx.transaction.delete({where: {id}})
        revalidatePath('transactions')
    })
}
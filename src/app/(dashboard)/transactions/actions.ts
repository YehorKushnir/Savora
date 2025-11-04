'use server'

import {prisma} from '@/prisma'
import {Prisma} from '@prisma/client'
import {auth} from '@/auth'
import {TransactionCreateUpdateType} from '@/src/lib/types/transaction-create-update-type'
import {createEntries} from '@/src/lib/helpers/create-entries'
import {restoreVaultBalances} from '@/src/lib/helpers/restore-vault-balances'
import {revalidatePath} from 'next/cache'

export const getTransactions = async () => {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    return prisma.transaction.findMany({
        where: {
            userId
        },
        orderBy: {executedAt: 'desc'}
    })
}

export const getTransactionsByVault = async (vaultId: string) => {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    return prisma.transaction.findMany({
        where: {
            userId,
            entries: {some: {vaultId}},
        },
        include: {
            entries: {
                include: {
                    vault: true
                }
            },
            tags: true
        },
        orderBy: {executedAt: 'desc'}
    })
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
        const transaction = await db.transaction.create({
            data: {
                userId,
                type: payload.type,
                description: payload.description || null,
                executedAt: payload.executedAt,
                tags: payload.tagIds?.length
                    ? {connect: payload.tagIds.map((id) => ({id}))}
                    : undefined,
            },
        })

        await createEntries(db, transaction.id, payload.sourceVaultId, payload.targetVaultId, amount)
    }

    tx
        ? await run(tx)
        : await prisma.$transaction(run)

    revalidatePath('transactions')
}

export const updateTransaction = async (id: string, payload: TransactionCreateUpdateType) => {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthorized')

    if (!payload.amount || Number(payload.amount) <= 0) {
        throw new Error('Amount must be positive')
    }

    const amount = new Prisma.Decimal(payload.amount)

    await prisma.$transaction(async (tx) => {
        const existing = await tx.transaction.findUnique({
            where: {id},
            include: {entries: true},
        })

        if (!existing) throw new Error('Transaction not found')

        await restoreVaultBalances(tx, existing.entries, id)

        const updated = await tx.transaction.update({
            where: {id},
            data: {
                type: payload.type,
                description: payload.description || null,
                executedAt: payload.executedAt,
                tags: payload.tagIds?.length
                    ? {set: payload.tagIds.map((tagId) => ({id: tagId}))}
                    : {set: []},
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
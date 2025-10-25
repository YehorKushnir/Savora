'use server'

import {prisma} from '@/prisma'
import {revalidateTag, unstable_cache} from 'next/cache'
import {z} from 'zod'
import {transactionSchema, TTransaction} from '@/src/components/transaction-modal'
import {Prisma} from '@prisma/client'

export const getTransactions = unstable_cache(
    async () => prisma.transaction.findMany({
        orderBy: {updatedAt: 'asc'},
        include: {
            Category: true,
            Subcategory: true,
        },
    }),
    ['transactions'],
    {tags: ['transactions']}
)

export async function createTransaction(payload: TTransaction) {
    const data = transactionSchema.parse(payload)

    prisma.$transaction(async transaction => {
        const getWallet = (id: string) =>
            transaction.wallet.findUnique({
                where: {id},
                select: {id: true, balance: true, currency: true},
            })

        // if (data.type === 'transfer') {
        //     if (!(data.sourceWalletId && data.targetWalletId && data.toReceive)) {
        //         return {ok: false, message: 'Failed to create transfer'}
        //     }
        //     transaction.transaction.create({
        //         data: {
        //             type: payload.type,
        //             amount: Prisma.Decimal(payload.amount),
        //
        //         }
        //     })
        // }
    })
    revalidateTag('transactions')
}

export async function updateTransaction(id: string, data: TTransaction) {
    await prisma.transaction.update({where: {id}, data})
    revalidateTag('transactions')
}

export async function deleteTransaction(id: string) {
    await prisma.transaction.delete({where: {id}})
    revalidateTag('transactions')
}
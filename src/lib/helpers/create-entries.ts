import { EntryType, Prisma } from '@prisma/client'

export const createEntries = async (
    tx: Prisma.TransactionClient,
    transactionId: string,
    sourceVaultId: string,
    targetVaultId: string | undefined | null,
    amount: Prisma.Decimal
) => {
    const transaction = await tx.transaction.findUniqueOrThrow({
        where: { id: transactionId },
    })

    if (transaction.type === 'expense') {
        const vault = await tx.vault.findUniqueOrThrow({
            where: { id: sourceVaultId }
        })

        await tx.entry.create({
            data: {
                transactionId,
                vaultId: sourceVaultId,
                type: EntryType.debit,
                amount: amount.negated(),
                balanceBefore: vault.balance,
                balanceAfter: vault.balance.minus(amount),
                currency: vault.currency,
            }
        })

        await tx.vault.update({
            where: { id: sourceVaultId },
            data: { balance: { decrement: amount } }
        })
    }

    else if (transaction.type === 'income') {
        const vault = await tx.vault.findUniqueOrThrow({
            where: { id: sourceVaultId }
        })

        await tx.entry.create({
            data: {
                transactionId,
                vaultId: sourceVaultId,
                type: EntryType.credit,
                amount: amount,
                balanceBefore: vault.balance,
                balanceAfter: vault.balance.plus(amount),
                currency: vault.currency,
            }
        })

        await tx.vault.update({
            where: { id: sourceVaultId },
            data: { balance: { increment: amount } }
        })
    }

    else if (transaction.type === 'transfer') {
        if (!targetVaultId) throw new Error('Target vault is required for transfers')

        const sourceVault = await tx.vault.findUniqueOrThrow({ where: { id: sourceVaultId } })
        const targetVault = await tx.vault.findUniqueOrThrow({ where: { id: targetVaultId } })

        await tx.entry.createMany({
            data: [
                {
                    transactionId,
                    vaultId: sourceVaultId,
                    type: EntryType.debit,
                    amount: amount.negated(),
                    balanceBefore: sourceVault.balance,
                    balanceAfter: sourceVault.balance.minus(amount),
                    currency: sourceVault.currency
                },
                {
                    transactionId,
                    vaultId: targetVaultId,
                    type: EntryType.credit,
                    amount: amount,
                    balanceBefore: targetVault.balance,
                    balanceAfter: targetVault.balance.plus(amount),
                    currency: targetVault.currency
                },
            ],
        })

        await tx.vault.update({
            where: { id: sourceVaultId },
            data: { balance: { decrement: amount } },
        })
        await tx.vault.update({
            where: { id: targetVaultId },
            data: { balance: { increment: amount } },
        })
    }
}

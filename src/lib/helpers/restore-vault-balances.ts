import {EntryType, Prisma} from '@prisma/client'

export const restoreVaultBalances = async (
    tx: Prisma.TransactionClient,
    entries: {
        vaultId: string,
        type: EntryType,
        amount: Prisma.Decimal
    }[],
    id: string
) => {
    for (const entry of entries) {
        const vault = await tx.vault.findUnique({where: {id: entry.vaultId}})
        if (!vault) continue

        const adjustment =
            entry.type === EntryType.debit
                ? vault.balance.minus(entry.amount)
                : vault.balance.plus(entry.amount)

        await tx.vault.update({
            where: {id: vault.id},
            data: {balance: adjustment},
        })
    }

    await tx.entry.deleteMany({where: {transactionId: id}})
}
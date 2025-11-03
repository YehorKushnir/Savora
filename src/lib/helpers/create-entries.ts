import {EntryType, Prisma} from '@prisma/client'
import {getVaults} from '@/src/lib/helpers/get-vaults'

export const createEntries = async (
    tx: Prisma.TransactionClient,
    transactionId: string,
    sourceVaultId: string,
    targetVaultId: string,
    amount: Prisma.Decimal
) => {
    const {sourceVault, targetVault} = await getVaults(tx, sourceVaultId, targetVaultId)

    await tx.entry.createMany({
        data: [
            {
                transactionId,
                vaultId: targetVault.id,
                type: EntryType.debit,
                amount,
                balanceBefore: targetVault.balance,
                balanceAfter: targetVault.balance.plus(amount),
            },
            {
                transactionId,
                vaultId: sourceVault.id,
                type: EntryType.credit,
                amount,
                balanceBefore: sourceVault.balance,
                balanceAfter: sourceVault.balance.minus(amount),
            },
        ],
    })

    await tx.vault.update({
        where: {id: targetVault.id},
        data: {balance: {increment: amount}},
    })
    await tx.vault.update({
        where: {id: sourceVault.id},
        data: {balance: {decrement: amount}},
    })
}

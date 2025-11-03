import {TransactionCreateType} from '@/src/lib/types/transaction-create-type'

export function transactionDto(data: TransactionCreateType) {
    return {
        type: data.type,
        amount: data.amount,
        sourceVaultId: data.sourceVaultId,
        targetVaultId: data.targetVaultId,
        description: data.description,
        executedAt: data.executedAt,
        tagIds: data.tagIds
    }
}
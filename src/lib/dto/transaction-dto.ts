import {TransactionCreateUpdateType} from '@/src/lib/types/transaction-create-update-type'

export function transactionDto(data: TransactionCreateUpdateType) {
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
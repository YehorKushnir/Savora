export interface TransactionCreateType {
    type: 'expense' | 'income' | 'transfer' | 'adjustment'
    amount: string
    sourceVaultId: string
    targetVaultId: string
    description: string
    executedAt: Date
    tagIds: string[]
}
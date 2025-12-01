export interface TransactionCreateUpdateType {
    type: 'expense' | 'income' | 'transfer' | 'adjustment' | 'initial'
    amount: string
    sourceVaultId: string
    targetVaultId: string
    description: string
    executedAt: Date
    tagIds: string[]
    tagName?: string;
    categoryId?: string;
}
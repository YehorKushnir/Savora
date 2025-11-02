export type TransactionEntry = {
    type: 'debit' | 'credit';
    amount: number;
    vaultId: string;
    balanceBefore?: number;
    balanceAfter?: number;
    transactionId: string;
}

export interface Transaction {
    id: string
    userId?: string
    type: 'expense' | 'income' | 'transfer' | 'adjustment'
    description?: string
    executedAt: string
    baseAmount: number
    exchangeRate: string
    tags?: string[]
    entries: TransactionEntry[]
    createdAt: Date
}

export type Transactions = Transaction[];
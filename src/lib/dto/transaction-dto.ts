import {TTransaction} from '@/src/components/transaction-modal'

interface TransferDTO {
    type: 'transfer' | 'income' | 'expense'
    amount: string
    toReceive?: string
    tag?: string
    description?: string
    sourceWalletId?: string
    targetWalletId?: string
}

export function transferDto(data: TTransaction): TransferDTO {
    return {
        type: data.type,
        amount: data.amount,
        toReceive: data.toReceive,
        tag: data.tag,
        description: data.description,
        sourceWalletId: data.sourceWalletId,
        targetWalletId: data.targetWalletId
    }
}

interface IncomeOrExpenseDTO {
    type:  'transfer' | 'income' | 'expense'
    amount: string
    tag?: string
    description?: string
    sourceWalletId?: string
    categoryId?: string
    subcategoryId?: string
}

export function incomeOrExpenseDto(data: TTransaction): IncomeOrExpenseDTO {
    return {
        type: data.type,
        amount: data.amount,
        tag: data.tag,
        description: data.description,
        sourceWalletId: data.sourceWalletId,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId
    }
}
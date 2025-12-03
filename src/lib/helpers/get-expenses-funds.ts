import { TransactionWithRelations } from "@/src/lib/types/transactions";

export function getExpenseFunds(transactions: TransactionWithRelations[]): [string, string] {
    const expenseSum = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => {
            const amount = tx.entries[0]?.amount ? Number(tx.entries[0].amount) : 0
            return sum + Math.abs(amount)
        }, 0);

    const totalSum = transactions
        .reduce((sum, tx) => {
            const amount = tx.entries[0]?.amount ? Number(tx.entries[0].amount) : 0
            return sum + Math.abs(amount)
        }, 0);

    const percentage = totalSum > 0 ? (expenseSum / totalSum) * 100 : 0;

    const formattedAmount = expenseSum < 10
        ? expenseSum.toFixed(2)
        : expenseSum.toFixed(0);

    const formattedPercentage = percentage.toFixed(2);

    return [formattedAmount, formattedPercentage];
}

import { TransactionWithRelations } from "@/src/lib/types/transactions";

export function getIncomeFunds(transactions: TransactionWithRelations[]): [string, string] {
    const incomeSum = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => {
            // Берем сумму из первой записи (entries[0]), используем модуль числа
            const amount = tx.entries[0]?.amount ? Number(tx.entries[0].amount) : 0
            return sum + Math.abs(amount)
        }, 0);

    const totalSum = transactions
        .reduce((sum, tx) => {
            const amount = tx.entries[0]?.amount ? Number(tx.entries[0].amount) : 0
            return sum + Math.abs(amount)
        }, 0);

    const percentage = totalSum > 0 ? (incomeSum / totalSum) * 100 : 0;

    const formattedAmount = incomeSum < 10 ? incomeSum.toFixed(2) : incomeSum.toFixed(0);
    const formattedPercentage = percentage.toFixed(2);

    return [formattedAmount, formattedPercentage];
}

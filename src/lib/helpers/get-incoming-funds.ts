import { Transaction } from "@/src/lib/types/transactions";

export function getIncomeFunds(transactions: Transaction[]) {
    const incomeSum = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.baseAmount, 0);

    const totalSum = transactions
        .reduce((sum, tx) => sum + tx.baseAmount, 0);

    const percentage = totalSum > 0 ? (incomeSum / totalSum) * 100 : 0;

    const formattedAmount = incomeSum < 10 ? incomeSum.toFixed(2) : incomeSum.toFixed(0);
    const formattedPercentage = percentage.toFixed(2); // округление до 2 знаков

    return [formattedAmount, formattedPercentage];
}

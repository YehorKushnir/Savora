import { Transactions } from "@/src/lib/types/transactions";

export function filterTransactionsByDate(
    data: Transactions,
    timeRange: string
): Transactions {
    const referenceDate = new Date();
    const daysToSubtract = +timeRange;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return data.filter((item) => {
        const date = new Date(item.executedAt);
        return date >= startDate;
    });
}
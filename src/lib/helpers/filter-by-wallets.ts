import { Transactions } from "@/src/lib/types/transactions";

export function filterTransactionsByWallets(transactions: Transactions, activeWallets: string[]) {
    if (!activeWallets || activeWallets.length === 0) {
        return transactions;
    }

    return transactions.filter(tx =>
        tx.entries.some((entry) => activeWallets.includes(entry.vaultId))
    );
}
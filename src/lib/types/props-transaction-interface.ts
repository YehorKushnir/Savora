import {TransactionWithRelations} from "@/src/lib/types/transactions";

export interface PropsTransactionInterface {
    transactions: Promise<TransactionWithRelations[]>
}
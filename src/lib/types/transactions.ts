import { Transaction, Entry, Tag, Category } from '@prisma/client'

export type TransactionWithRelations = Transaction & {
    entries: Entry[]
    tags: Tag[]
    Category?: Category | null
}

export type Transactions = TransactionWithRelations[];
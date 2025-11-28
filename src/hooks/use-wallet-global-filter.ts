import {Row} from "@tanstack/react-table"
import {TransactionWithRelations} from '@/src/lib/types/transactions'

function formatDateDDMMYYYY(input: string | Date): string | null {
    if (!input) return null
    const dateObj = new Date(input)
    if (isNaN(dateObj.getTime())) return null

    const dd = String(dateObj.getDate()).padStart(2, "0")
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0")
    const yyyy = String(dateObj.getFullYear())

    return `${dd}.${mm}.${yyyy}`
}

export function useTransactionGlobalFilter() {
    return (row: Row<TransactionWithRelations>, _columnId: string, rawSearch: string) => {
        const rowData = row.original
        const rawText = String(rawSearch ?? "").trim()
        const query = rawText.toLowerCase()

        if (query.length === 0) return true

        const formattedDate = formatDateDDMMYYYY(rowData.executedAt)

        const tagsString = rowData.tags?.map(t => t.name).join(" ") || ""

        const categoryName = rowData.Category?.name || ""

        const textFields = [
            rowData.description,
            rowData.type,
            categoryName,
            tagsString,
            formattedDate,
        ]

        const numericPattern = /^[\d,.]+$/
        const isNumericQuery = numericPattern.test(rawText)

        if (isNumericQuery) {
            const amount = rowData.entries[0]?.amount

            if (amount !== undefined && amount !== null) {
                const amountStr = String(Math.abs(Number(amount))).replace(",", ".")
                const queryStr = rawText.replace(",", ".")

                if (amountStr.includes(queryStr)) {
                    return true
                }
            }
        }

        return textFields
            .filter((v) => v !== undefined && v !== null)
            .some((v) => String(v).toLowerCase().includes(query))
    }
}
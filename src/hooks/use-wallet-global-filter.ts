import {Row} from "@tanstack/react-table"
import {Transaction} from "@/src/lib/types/transactions";

type AnyRow = Row<any>

function formatDateDDMMYYYY(input: string): string | null {
    if (!input) return null
    const dateObj = new Date(input)
    if (isNaN(dateObj.getTime())) return null

    const dd = String(dateObj.getDate()).padStart(2, "0")
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0")
    const yyyy = String(dateObj.getFullYear())

    return `${dd}.${mm}.${yyyy}`
}

export function useWalletGlobalFilter() {
    return (row: AnyRow, _columnId: string, rawSearch: string) => {
        const rowData: Transaction = row.original
        console.log(rowData)

        const rawText = String(rawSearch ?? "").trim()
        const query = rawText.toLowerCase()
        const isSearching = query.length > 0

        if (!isSearching) {
            return true
        }

        const formattedDate = formatDateDDMMYYYY(rowData.executedAt)

        const targetValues = (rowData.entries || [])
            .filter((entry: any) => entry.type === "debit")
            .map((entry: any) => entry.vaultId?.replace(/^seed_vault_/, "") || "")
            .join(" ")

        const parentFields = [
            rowData.id,
            rowData.executedAt,
            formattedDate,
            rowData.type,
            rowData.description,
            rowData.baseAmount,
            targetValues,
        ]
        const numericPattern = /^\d{1,3}(?:,\d{3})*(?:\.\d+)?$/
        const isNumericQuery = numericPattern.test(rawText)

        if (isNumericQuery) {
            const parentNumbers = [rowData.baseAmount]

            const parentNumberMatch = parentNumbers.some((num) => {
                if (num === undefined || num === null) return false
                return String(num)
                    .replace(",", ".")
                    .includes(rawText.replace(",", "."))
            })

            if (parentNumberMatch) {
                return true
            }
        }

        return parentFields // Match
            .filter((v) => v !== undefined && v !== null)
            .some((v) => String(v).toLowerCase().includes(query));
    }
}
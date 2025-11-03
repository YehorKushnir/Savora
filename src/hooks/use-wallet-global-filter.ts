import { Row } from "@tanstack/react-table"

type ExpandedState = Record<string, boolean>
type AnyRow = Row<any>
type EntryLike = Record<string, unknown> & {
  amount?: number | string
}

function formatDateDDMMYYYY(input: any): string | null {
    if (!input) return null
    const dateObj = new Date(input)
    if (isNaN(dateObj.getTime())) return null

    const dd = String(dateObj.getDate()).padStart(2, "0")
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0")
    const yyyy = String(dateObj.getFullYear())

    return `${dd}.${mm}.${yyyy}`
}

export function useWalletGlobalFilter(_expanded: ExpandedState) {
    return (row: AnyRow, _columnId: string, rawSearch: string) => {
        const rowData: any = row.original

        const rawText = String(rawSearch ?? "").trim()
        const query = rawText.toLowerCase()
        const isSearching = query.length > 0

        // дочерняя строка (entry)
        if (row.depth > 0) {
            // дети никогда не режем фильтром.
            // они появляются только вместе с родителем, значит это безопасно
            return true
        }

        // родительская строка (transaction)
        if (!isSearching) {
            return true
        }

        // добавляем отформатированную дату в поля поиска
        const formattedDate = formatDateDDMMYYYY(rowData.executedAt)

        const parentFields = [
            rowData.id,
            rowData.executedAt,
            formattedDate,         // <- теперь можно искать "23.10.2025"
            rowData.type,
            rowData.description,
            rowData.vaultId,
            rowData.amount,
            rowData.baseAmount,
            rowData.currency,
        ]

        // числовой поиск: "18", "6.50", "320,00"
        const numericPattern = /^[0-9]+([.,][0-9]+)?$/
        const isNumericQuery = numericPattern.test(rawText)

        if (isNumericQuery) {
            const parentNumbers = [rowData.amount, rowData.baseAmount]

            const parentNumberMatch = parentNumbers.some((num) => {
                if (num === undefined || num === null) return false
                return String(num)
                    .replace(",", ".")
                    .includes(rawText.replace(",", "."))
            })

            const entries = Array.isArray(rowData.entries) ? (rowData.entries as EntryLike[]) : []
            const childNumberMatch = entries.some((entry: EntryLike) => {
              const amt = entry?.amount
              if (amt === undefined || amt === null) return false
              return String(amt)
                .replace(",", ".")
                .includes(rawText.replace(",", "."))
            })

            if (parentNumberMatch || childNumberMatch) {
                return true
            }
        }

        const entries = Array.isArray(rowData.entries) ? (rowData.entries as EntryLike[]) : []
        const entriesText = entries
          .map((entry: EntryLike) => Object.values(entry ?? {}).join(" "))
          .join(" ")
          .toLowerCase()

        const parentMatch = parentFields
            .filter((v) => v !== undefined && v !== null)
            .some((v) => String(v).toLowerCase().includes(query))

        if (parentMatch) {
            return true
        }

        if (entriesText.includes(query)) {
            return true
        }

        return false
    }
}
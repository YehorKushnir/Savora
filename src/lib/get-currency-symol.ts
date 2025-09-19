export function getCurrencySymbol(code: string, locale = "en-US") {
    return (0).toLocaleString(locale, {
        style: "currency",
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).replace(/\d/g, "").trim()
}
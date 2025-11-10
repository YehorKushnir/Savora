
export const cleanLabel = (label: string) =>
    label
        .replace(/^seed_vault_/i, "")
        .replace(/_/g, " ")
        .replace(/\b(\w)/g, (m) => m.toUpperCase());

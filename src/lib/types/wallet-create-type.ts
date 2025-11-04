export interface WalletCreateType {
    name: string
    balance: string
    icon: string
    currency: string
    type: 'asset' | 'liability'
}
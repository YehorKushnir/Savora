import {WalletCreateType} from '@/src/lib/types/wallet-create-type'

export function walletCreateDto (data: WalletCreateType) {
    return {
        name: data.name,
        balance: data.balance,
        icon: data.icon,
        type: data.type,
        currency: data.currency
    }
}
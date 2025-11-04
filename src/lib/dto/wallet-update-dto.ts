import {WalletUpdateType} from '@/src/lib/types/wallet-update-type'

export function walletUpdateDto (data: WalletUpdateType) {
    return {
        name: data.name,
        balance: data.balance,
        icon: data.icon
    }
}
import {Vault} from "@prisma/client";

export type ClientWallet = Omit<Vault, 'balance'> & {
    balance: string | number
}
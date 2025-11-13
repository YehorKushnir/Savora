import axios from 'axios'
import {ICurrencies} from '@/src/lib/types/currencies'
import {Transactions} from "@/src/lib/types/transactions";
import {Wallet} from "@/src/lib/types/wallets"

export async function getCurrencies() {
    const res = await axios.get<{
        currencies: ICurrencies
    }>(`http://localhost:3000/currencies.json`)
    return res.data.currencies
}

export async function getCurrenciesRatesByEUR() {
    const res = await axios.get<{
        currencies: ICurrencies
    }>(`http://localhost:3000/exchangeRatesByEUR.json`)
    return res.data.currencies
}

export async function getTransactions() {
    const res = await axios.get<{
        transactions: Transactions
    }>(`http://localhost:3000/mock/transactions.json`)
    return res.data.transactions
}
import axios from 'axios'
import {ICurrencies} from '@/src/lib/types/currencies'

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
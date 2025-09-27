import axios from 'axios'
import {ICurrencies} from '@/src/lib/types/currencies'

export async function getCurrencies() {
    const res = await axios.get<{
        currencies: ICurrencies
    }>(`https://openexchangerates.org/api/currencies.json?api_key=${process.env.NEXT_PUBLIC_CURRENCIES_KEY}`)
    return res.data
}
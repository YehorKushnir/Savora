import axios from 'axios'
import {ICurrencies} from '@/src/lib/types/currencies'

export async function getEchageRatesAll(from: string) {
    const res = await axios.get("https://api.fastforex.io/fetch-all?api_key=f3bfddd294-5e73e44bfc-t2u3hj&from=EUR")
    return res.data
}

export async function getEchageRatesMulti() {
    const res = await axios.get("https://api.fastforex.io/fetch-multi?api_key=f3bfddd294-5e73e44bfc-t2u3hj&from=EUR")
    return res.data
}

export async function getCurrencies() {
    const res = await axios.get<{
        currencies: ICurrencies
    }>("https://api.fastforex.io/currencies?api_key=f3bfddd294-5e73e44bfc-t2u3hj")
    return res.data.currencies
}
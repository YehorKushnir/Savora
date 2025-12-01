import axios from 'axios'
import {ICurrencies} from '@/src/lib/types/currencies'
import { auth } from '@/auth'
import { prisma } from '@/prisma'

export const updateUserLocale = async (newLocale: string) => {
    const session = await auth();
    if (!session?.user?.id) return;

    await prisma.user.update({
        where: { id: session.user.id },
        data: { locale: newLocale }
    });
}

export async function getCurrencies() {
    const res = await axios.get<{
        currencies: ICurrencies
    }>(`http://localhost:3000/currencies.json`)
    return res.data.currencies
}
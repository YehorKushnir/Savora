import { ICurrencies } from '@/src/lib/types/currencies';
import { promises as fs } from 'fs';
import path from 'path';

export async function getCurrencies(): Promise<ICurrencies> {
    const jsonPath = path.join(process.cwd(), 'public', 'currencies.json');
    const fileContents = await fs.readFile(jsonPath, 'utf8');
    const data = JSON.parse(fileContents);

    return data.currencies;
}
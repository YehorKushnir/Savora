import {prisma} from '@/prisma'
import {NextRequest} from 'next/server'
import {Prisma} from '@prisma/client'
import {revalidateTag} from 'next/cache'

export const dynamic = 'force-static'

export async function GET() {
    const data = await prisma.wallet.findMany()
    return Response.json({data})
}

export async function POST(req: NextRequest) {
    const data = await req.json()
    await prisma.wallet.create({
        data: {
            ...data,
            balance: new Prisma.Decimal(data.balance),
        }
    })
    revalidateTag('wallets')
    return Response.json({msg: 'success', data})
}
import {FC} from 'react'
import {prisma} from '@/prisma'
import {Card, CardAction, CardDescription, CardHeader, CardTitle} from '@/src/components/ui/card'
import LucideIcon, {IconName} from '@/src/components/lucide-icon'

const WalletList: FC = async () => {
    const data = await prisma.wallet.findMany()

    return (
        <div className={'min-w-60 flex flex-col items-center gap-2'}>
            {data.map((item) => (
                <Card key={item.id} className={'w-full flex flex-row gap-4 items-center py-2 px-4'}>
                    <LucideIcon name={item.icon as IconName} size={40}/>
                    <CardHeader className={'w-full p-0'}>
                        <CardTitle className={'flex'}>{item.name}</CardTitle>
                        <CardDescription>card</CardDescription>
                        <CardAction>1000$</CardAction>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}

export default WalletList
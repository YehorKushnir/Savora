import {FC} from 'react'
import {Card, CardDescription, CardHeader, CardTitle} from '@/src/components/ui/card'
import LucideIcon, {IconName} from '@/src/components/lucide-icon'
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from '@/src/components/ui/context-menu'
import {deleteWallet, getWallets} from '@/src/app/(dashboard)/wallets/actions'
import {getCurrencySymbol} from '@/src/lib/get-currency-symol'

const WalletList: FC = async () => {
    const data = await getWallets()

    return (
        <>
            {data.map((item) => (
                <ContextMenu key={item.id}>
                    <ContextMenuTrigger className={'w-full'}>
                        <Card className={'w-full flex flex-row gap-4 items-center py-2 px-4 rounded-md'}>
                            <LucideIcon name={item.icon as IconName} size={40}/>
                            <CardHeader className={'w-full p-0'}>
                                <CardTitle className={'flex'}>{item.name}</CardTitle>
                                <CardDescription>{getCurrencySymbol(item.currency)} {`${item.balance}`}</CardDescription>
                            </CardHeader>
                        </Card>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <form action={async () => {
                            'use server'
                            await deleteWallet(item.id)
                        }}>
                            <ContextMenuItem asChild>
                                <button type="submit" className="w-full">Delete</button>
                            </ContextMenuItem>
                        </form>
                    </ContextMenuContent>
                </ContextMenu>
            ))}
        </>
    )
}

export default WalletList
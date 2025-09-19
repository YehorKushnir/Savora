import {FC} from 'react'
import {Card, CardDescription, CardHeader, CardTitle} from '@/src/components/ui/card'
import LucideIcon, {IconName} from '@/src/components/lucide-icon'
import {ContextMenu, ContextMenuContent, ContextMenuTrigger} from '@/src/components/ui/context-menu'
import {getWallets} from '@/src/app/(dashboard)/wallets/actions'
import {getCurrencySymbol} from '@/src/lib/get-currency-symol'
import WalletListActions from '@/src/components/wallet-list-actions'

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
                        <WalletListActions wallet={{...item, balance: String(item.balance)}}/>
                    </ContextMenuContent>
                </ContextMenu>
            ))}
        </>
    )
}

export default WalletList
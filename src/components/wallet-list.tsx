'use client'

import {FC, useState, useEffect} from 'react'
import {Card, CardDescription, CardHeader, CardTitle} from '@/src/components/ui/card'
import LucideIcon, {IconName} from '@/src/components/lucide-icon'
import {ContextMenu, ContextMenuContent, ContextMenuTrigger} from '@/src/components/ui/context-menu'
import {getCurrencySymbol} from '@/src/lib/get-currency-symol'
import WalletListActions from '@/src/components/wallet-list-actions'
import {useSearchParams} from "next/navigation"
import {Wallet, useWallets} from "@/src/lib/stores/wallets-store"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

interface Props {
    wallets: Wallet[]
}

interface SortableWalletItemProps {
    wallet: Wallet
    active: string
    onSelect: (id: string) => void
}

const SortableWalletItem: FC<SortableWalletItemProps> = ({wallet, active, onSelect}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: wallet.id})

    const restrictedTransform = transform
        ? { ...transform, x: 0 }
        : null
    // x

    const style = {
        transform: CSS.Transform.toString(restrictedTransform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const clsx = active === wallet.id ? 'border-2 border-[var(--accent-foreground)]' : 'border-2 border-transparent'

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ContextMenu>
                <ContextMenuTrigger className={'w-full'}>
                    <Card
                        onClick={() => onSelect(wallet.id)}
                        className={`w-full flex flex-row gap-4 items-center py-2 px-4 rounded-md cursor-pointer ${clsx}`}
                    >
                        <LucideIcon name={wallet.icon as IconName} size={40}/>
                        <CardHeader className={'w-full p-0'}>
                            <CardTitle className={'flex'}>{wallet.name}</CardTitle>
                            <CardDescription>{getCurrencySymbol(wallet.currency)} {`${wallet.balance}`}</CardDescription>
                        </CardHeader>
                    </Card>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <WalletListActions wallet={{...wallet, balance: String(wallet.balance)}}/>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    )
}

const WalletList: FC<Props> = ({wallets}) => {
    const searchParams = useSearchParams()
    const storeWallets = useWallets((state) =>  state.storeWallets)
    const setWallets = useWallets((state) =>  state.setWallets)
    const reorderWallets = useWallets((state) =>  state.reorderWallets)
    const initialActive = searchParams.get('activeWallet')
        || (wallets.length ? wallets[0].id : '')
    const [active, setActive] = useState(initialActive)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        if (wallets.length > 0) {
            setWallets(wallets)
        }
    }, [wallets, setWallets])

    useEffect(() => {
        const current = searchParams.get('activeWallet')
        if (current && current !== active) {
            setActive(current)
        }
    }, [searchParams, active])

    function updateActiveWallet(walletId: string) {
        const params = new URLSearchParams(searchParams.toString())
        setActive(walletId)
        params.set('activeWallet', walletId)
        window.history.pushState(null, '', `?${params.toString()}`)
    }

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event

        if (over && active.id !== over.id) {
            reorderWallets(active.id as string, over.id as string)
        }
    }

    const displayWallets = storeWallets.length > 0 ? storeWallets : wallets

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={displayWallets.map(w => w.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-4 w-full">
                    {displayWallets.map((wallet) => (
                        <SortableWalletItem
                            key={wallet.id}
                            wallet={wallet}
                            active={active}
                            onSelect={updateActiveWallet}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}

export default WalletList
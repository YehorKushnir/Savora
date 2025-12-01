'use client'

import {FC, useEffect, use} from 'react'
import {Card, CardDescription, CardHeader, CardTitle} from '@/src/components/ui/card'
import LucideIcon, {IconName} from '@/src/components/lucide-icon'
import {ContextMenu, ContextMenuContent, ContextMenuTrigger} from '@/src/components/ui/context-menu'
import {getCurrencySymbol} from '@/src/lib/get-currency-symol'
import WalletListActions from '@/src/components/wallet-list-actions'
import {useWalletSelection} from "@/src/lib/stores/wallet-selection-store"
import {useWallets} from "@/src/lib/stores/wallets-store"
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
import { ClientWallet } from '../lib/types/client-wallet-type'

interface Props {
    wallets: Promise<ClientWallet[]>
}

interface SortableWalletItemProps {
    wallet: ClientWallet
    activeId: string
    onSelect: (id: string) => void
}

const SortableWalletItem: FC<SortableWalletItemProps> = ({wallet, activeId, onSelect}) => {
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

    const style = {
        transform: CSS.Transform.toString(restrictedTransform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const isActive = activeId === wallet.id
    const clsx = isActive ? 'border-2 border-[var(--accent-foreground)]' : 'border-2 border-transparent'

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ContextMenu>
                <ContextMenuTrigger className={'w-full'}>
                    <Card
                        onClick={() => onSelect(wallet.id)}
                        className={`w-full flex flex-row gap-4 items-center py-2 px-4 rounded-md cursor-pointer transition-colors ${clsx}`}
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

const WalletList = (props: Props) => {
    const wallets = use(props.wallets)

    const activeWalletId = useWalletSelection(state => state.activeWalletId)
    const setActiveWalletId = useWalletSelection(state => state.setActiveWalletId)

    const storeWallets = useWallets((state) =>  state.storeWallets)
    const setWallets = useWallets((state) =>  state.setWallets)
    const reorderWallets = useWallets((state) =>  state.reorderWallets)

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
        if (activeWalletId) return

        if (wallets.length > 0) {
            const defaultId = wallets[0].id
            setActiveWalletId(defaultId)

            const params = new URLSearchParams(window.location.search)
            params.set('activeWallet', defaultId)
            window.history.replaceState(null, '', `?${params.toString()}`)
        }
    }, [wallets, activeWalletId, setActiveWalletId])

    function updateActiveWallet(walletId: string) {
        setActiveWalletId(walletId)

        const params = new URLSearchParams(window.location.search)
        params.set('activeWallet', walletId)
        window.history.replaceState(null, '', `?${params.toString()}`)
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
                            activeId={activeWalletId || ''}
                            onSelect={updateActiveWallet}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}

export default WalletList
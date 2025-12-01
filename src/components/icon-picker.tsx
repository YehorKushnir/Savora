"use client"

import {icons} from "lucide-react"
import type {LucideIcon} from "lucide-react"
import {useVirtualizer} from '@tanstack/react-virtual'
import {useEffect, useMemo, useRef, useState} from 'react'
import {useIsMobile} from '@/src/lib/hooks/use-is-mobile'
import { IconPickerProps, IconName } from "../lib/types/icon-picker-types"

export default function IconPicker({value, onIconChange}: IconPickerProps) {

    const RAW_BANKING_ICONS: string[] = [
        'Wallet', 'CreditCard', 'Banknote', 'Landmark', 'PiggyBank', 'Coins', 'DollarSign', 'Euro', 'Bitcoin', 'Vault',
        'Briefcase', 'TrendingUp', 'Award', 'Gem',
            'Armchair', 'Bed', 'Hammer', 'Wrench', 'Box',
        'ShoppingCart', 'ShoppingBag', 'Utensils', 'Coffee', 'Beer', 'Pizza', 'Apple', 'Carrot',
        'Car', 'Bus', 'Plane', 'Ship', 'Fuel', 'Bike', 'MapPin',
        'Smartphone', 'Wifi', 'Zap', 'Droplet', 'Flame', 'Tv',
        'Heart', 'Activity', 'Stethoscope', 'Pill', 'Scissors', 'Smile',
        'GraduationCap', 'Book', 'Baby', 'Gamepad2', 'ToyBrick',
        'Tag', 'Tags', 'Gift', 'Music', 'Camera', 'Dog', 'Cat', 'Flower2',
    ];

    const BANKING_ICONS: IconName[] = useMemo(() => {
        return RAW_BANKING_ICONS.filter(name => {
            const exists = name in icons;
            if (!exists) console.warn(`IconPicker: Иконка "${name}" не найдена в lucide-react и была скрыта.`);
            return exists;
        }) as IconName[];
    }, []);

    const [internal, setInternal] = useState<IconName>(value ?? "CreditCard")

    useEffect(() => {
        if (value && value !== internal) setInternal(value)
    }, [value])

    const selected = (value ?? internal) as IconName

    const pick = (name: IconName) => {
        setInternal(name)
        onIconChange?.(name)
    }

    const parentRef = useRef(null)
    const cols = useIsMobile() ? 5 : 8
    const tile = 48
    const g = useIsMobile() ? 12 : 11

    const rowCount = Math.ceil(BANKING_ICONS.length / cols)

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: () => tile + g,
        overscan: 6,
    })

    return (
        <div className="space-y-3">
            <div className="flex flex-col items-center gap-3">
                <div
                    ref={parentRef}
                    className="sm:w-[462px] w-[290px] h-[168px] overflow-y-auto overflow-x-hidden"
                >
                    <div
                        style={{
                            height: rowVirtualizer.getTotalSize(),
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const rowStart = virtualRow.index * cols
                            const rowEnd = Math.min(rowStart + cols, BANKING_ICONS.length)
                            const items = BANKING_ICONS.slice(rowStart, rowEnd)
                            return (
                                <div
                                    key={virtualRow.key}
                                    className="absolute top-0 left-0 w-full"
                                    style={{
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    <div
                                        className="grid justify-start sm:grid-cols-8 grid-cols-5"
                                        style={{gap: g}}
                                    >
                                        {items.map((name) => {
                                            const Icon = icons[name] as LucideIcon
                                            if (!Icon) return null;
                                            const active = name === selected
                                            return (
                                                <div
                                                    key={name}
                                                    onClick={() => pick(name)}
                                                    title={name}
                                                    className={`cursor-pointer flex items-center justify-center rounded-md shadow-xs hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring ${active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                                                    style={{ width: tile, height: tile }}
                                                >
                                                    <Icon size={Math.floor(tile * 0.66)} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
"use client"

import { useEffect, useState } from "react"
import { Input } from "@/src/components/ui/input"
import { useTranslations } from 'next-intl';

type WalletSearchProps = {
    value?: string
    onChangeAction: (val: string) => void
    placeholder?: string
    delay?: number
    className?: string
}

export function SavoraSearch({value = "", onChangeAction, placeholder, delay = 300, className = ""}: WalletSearchProps) {
    const t = useTranslations('Common');
    const [local, setLocal] = useState(value)

    const finalPlaceholder = placeholder || t('search_placeholder');

    useEffect(() => {
        setLocal(value)
    }, [value])

    useEffect(() => {
        const t = setTimeout(() => {
            onChangeAction(local)
        }, delay)
        return () => clearTimeout(t)
    }, [local, delay, onChangeAction])

    return (
        <Input
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder={finalPlaceholder}
            className={`${className} max-w-sm`}
        />
    )
}
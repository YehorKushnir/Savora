"use client"

import { useEffect, useState } from "react"
import { Input } from "@/src/components/ui/input"

type WalletSearchProps = {
    value?: string
    onChangeAction: (val: string) => void
    placeholder?: string
    delay?: number
}

export function WalletSearch({value = "", onChangeAction, placeholder = "Search Savora", delay = 300,}: WalletSearchProps) {

    const [local, setLocal] = useState(value)

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
            placeholder={placeholder}
            className="max-w-sm"
        />
    )
}
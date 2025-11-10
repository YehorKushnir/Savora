"use client"

import {PanelLeft, PanelTop} from "lucide-react";
import {Button} from "@/src/components/ui/button";
import {useSidebarStore} from '@/src/lib/stores/navbare-store'

export const ToggleSidebar = ({ disabled = false }: { disabled?: boolean }) => {
    const {type, toggleType, hydrated} = useSidebarStore()

    if (!hydrated) return null

    return (
        <Button onClick={toggleType} variant="ghost" disabled={disabled} className="h-9 w-9 p-0">
            {type === 'full'
                ? <PanelLeft className="h-[1.2rem] w-[1.2rem]"/>
                : <PanelTop className="h-[1.2rem] w-[1.2rem]"/>
            }
        </Button>
    )
}
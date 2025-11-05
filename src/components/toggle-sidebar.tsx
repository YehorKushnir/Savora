"use client"

import {PanelLeft, PanelTop} from "lucide-react";
import {Button} from "@/src/components/ui/button";
import {useSidebarStore} from '@/src/lib/stores/navbare-store'

export const ToggleSidebar = () => {
    const {type, toggleType, hydrated} = useSidebarStore()

    if (!hydrated) return null

    return (
        <Button onClick={toggleType} variant="ghost">
            {type === 'full' ? <PanelLeft className="w-5 h-5"/> : <PanelTop className="w-5 h-5"/>}
        </Button>
    )
}
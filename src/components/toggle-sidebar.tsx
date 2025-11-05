"use client"

import {useNavbar} from "@/src/lib/stores/navbare-store";
import {PanelLeft, PanelTop} from "lucide-react";
import {Button} from "@/src/components/ui/button";

export const ToggleSidebar = ( ) => {
    const { navbarState, toggleNavbar } = useNavbar()
    return (
       <Button onClick={toggleNavbar} variant="ghost">
           {navbarState === 'sidebar' ? <PanelLeft className="w-5 h-5" /> : <PanelTop className="w-5 h-5" />}
       </Button>
    )
}
"use client"

import {useNavbar} from "@/src/lib/stores/navbare-store";
import {Switch} from "@/src/components/ui/switch";

export const ToggleSidebar = () => {
    const {navbarState,toggleNavbar} = useNavbar()
    return (
       <>
           <Switch checked={navbarState} onCheckedChange={toggleNavbar} id="airplane-mode" className="scale-125 cursor-pointer" />
       </>
    )
}
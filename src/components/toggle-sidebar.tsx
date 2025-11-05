"use client"

import {useNavbar} from "@/src/lib/stores/navbare-store";
import {PanelLeft, PanelTop} from "lucide-react";
import {FC} from "react";
import {Switch} from "@/src/components/ui/switch";

interface Props {
    display?: boolean
}

export const ToggleSidebar: FC<Props> = ({ display = true } ) => {
    const { navbarState, toggleNavbar } = useNavbar()
    const isNavbar = navbarState === 'navbar';
    return (
       <>
           { display
               ?
               <div onClick={toggleNavbar} className="cursor-pointer active:scale-90 transition-transform duration-150">
                   {navbarState === 'sidebar' ? <PanelLeft className="w-5 h-5" /> : <PanelTop className="w-5 h-5" />}
               </div>
               :
               <Switch
                 checked={isNavbar}
                 onCheckedChange={toggleNavbar}
                 className="scale-125 cursor-pointer active:scale-115 transition-transform duration-150"
               />
           }
       </>
    )
}
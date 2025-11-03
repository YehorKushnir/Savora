"use client"

import { Button } from "@/src/components/ui/button"
import { Separator } from "@/src/components/ui/separator"
import { SidebarTrigger } from "@/src/components/ui/sidebar"
import {usePathname} from "next/navigation";
import {Switch} from "@/src/components/ui/switch";
import {useNavbar} from "@/src/lib/stores/navbare-store";

export function SiteHeader() {
    const {navbarState, toggleNavbar} = useNavbar()
    const pathname = usePathname()
    const formattedPath = pathname.replace("/", "").charAt(0).toUpperCase() + pathname.replace("/", "").slice(1)

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-4 lg:px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">{formattedPath}</h1>
                <div className="ml-auto flex items-center gap-4">
                    <Switch checked={navbarState} onCheckedChange={toggleNavbar} id="airplane-mode" className="scale-125 cursor-pointer" />
                </div>
            </div>
        </header>
    )
}

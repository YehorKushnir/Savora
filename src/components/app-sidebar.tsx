"use client"

import {NavMain} from "@/src/components/nav-main"
import {NavUser} from "@/src/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/src/components/ui/sidebar"
import Image from "next/image";
import {
    ChartNoAxesColumn,
    Gauge,
    LayoutDashboard,
    List,
    Wallet
} from "lucide-react";
import Link from "next/link";
import {ComponentProps} from 'react'

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Gauge
        },
        {
            title: "Wallets",
            url: "/wallets",
            icon: Wallet
        },
        {
            title: "Categories",
            url: "/categories",
            icon: LayoutDashboard
        },
        {
            title: "Transactions",
            url: "/transactions",
            icon: List
        },
        {
            title: "Statistics",
            url: "/statistics",
            icon: ChartNoAxesColumn
        }
    ]
}

export function AppSidebar({...props}: ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props} className="pr-0">
            <SidebarHeader className="">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href="#" className="flex gap-4">
                                <Image width={28} height={28} src={'/light.svg'} alt={'logo'}/>
                                <span className="text-base font-semibold">Savora</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser/>
            </SidebarFooter>
        </Sidebar>
    )
}

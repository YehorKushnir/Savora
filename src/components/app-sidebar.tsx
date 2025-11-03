"use client"

import {
    IconCategory,
    IconDashboard,
    IconDatabase,
    IconGraph,
    IconWallet,
} from "@tabler/icons-react"

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

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard
        },
        {
            title: "Wallets",
            url: "/wallets",
            icon: IconWallet
        },
        {
            title: "Categories",
            url: "/categories",
            icon: IconCategory
        },
        {
            title: "Transactions",
            url: "/transactions",
            icon: IconDatabase
        },
        {
            title: "Statistics",
            url: "/statistics",
            icon: IconGraph
        }
    ]
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props} className="pr-0">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <Image width={28} height={28} src={'/light.svg'} alt={'logo'}/>
                                <span className="text-base font-semibold">Savora</span>
                            </a>
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

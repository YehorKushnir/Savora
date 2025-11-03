"use client"

import * as React from "react"

import { NavDocuments } from "@/src/components/nav-documents"
import { NavMain } from "@/src/components/nav-main"
import { NavSecondary } from "@/src/components/nav-secondary"
import { NavUser } from "@/src/components/nav-user"
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
import {SessionProvider} from "next-auth/react";
import {
    ChartNoAxesColumn,
    Gauge,
    LayoutDashboard,
    List,
    MessageCircleQuestionMark, Search,
    Settings,
    Wallet
} from "lucide-react";
import Link from "next/link";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Gauge,
        },
        {
            title: "Wallets",
            url: "/wallets",
            icon: Wallet,
        },
        {
            title: "Categories",
            url: "/categories",
            icon: LayoutDashboard,
        },
        {
            title: "Transactions",
            url: "/transactions",
            icon: List,
        },
        {
            title: "Statistics",
            url: "/statistics",
            icon: ChartNoAxesColumn,
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "/settings",
            icon: Settings,
        },
        {
            title: "Get Help",
            url: "#",
            icon: MessageCircleQuestionMark,
        },
        {
            title: "Search",
            url: "#",
            icon: Search,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                <NavMain items={data.navMain} />
                {/*<NavDocuments items={data.documents} />*/}
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <SessionProvider>
                    <NavUser user={data.user} />
                </SessionProvider>
            </SidebarFooter>
        </Sidebar>
    )
}


"use client"
import {IconDashboard, IconWallet, IconCategory, IconDatabase, IconGraph} from "@tabler/icons-react"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/src/components/ui/sidebar"
import Link from "next/link";


export const NavMain = () => {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem key="Dashboard">
                        <SidebarMenuButton tooltip="Dashboard">
                            <IconDashboard />
                            <Link href="/dashboard">Dashboard</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key="Wallets">
                        <SidebarMenuButton tooltip="Wallets">
                            <IconWallet />
                            <Link href="/wallets">Wallets</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key="Categories">
                        <SidebarMenuButton tooltip="Categories">
                            <IconCategory />
                            <Link href="/categories">Categories</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key="Transactions">
                        <SidebarMenuButton tooltip="Transactions">
                            <IconDatabase/>
                            <Link href="/transactions">Transactions</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem key="Statistics">
                        <SidebarMenuButton tooltip="Statistics">
                            <IconGraph/>
                            <Link href="/statistics">Statistics</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

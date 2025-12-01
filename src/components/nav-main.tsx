"use client"

import {usePathname} from "next/navigation"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/src/components/ui/sidebar"
import Link from "next/link";
import {navigation} from "@/src/lib/navigation";

export const NavMain = () => {
    const pathname = usePathname()

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-4">
                <SidebarMenu className="gap-2">
                    {navigation.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <Link href={item.url}>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    isActive={pathname === item.url}
                                    className=" flex gap-4 items-center cursor-pointer"
                                >
                                    <div className="flex gap-4 items-center w-full">
                                        {item.icon && <item.icon/>}
                                        <span>{item.title}</span>
                                    </div>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

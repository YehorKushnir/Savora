"use client"

import { type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/src/components/ui/sidebar"
import {FC} from "react";
import Link from "next/link";

interface Props {
    items: {
        title: string
        url: string
        icon?: LucideIcon
    }[]
}

export const NavMain:FC<Props> = ({items}) => {
    const pathname = usePathname()
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-4">
                <SidebarMenu className="gap-2">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title}
                                               isActive={pathname === item.url}
                                               className="text-gray-700 hover:bg-gray-100 flex gap-4 items-center cursor-pointer data-[active=true]:!bg-gray-200 data-[active=true]:!text-gray-900 data-[active=true]:!font-bold">
                                <Link href={item.url} className="flex gap-4 items-center w-full">
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

"use client"

import {
    IconCreditCard,
    IconDotsVertical,
    IconLogout,
    IconNotification,
    IconUserCircle,
} from "@tabler/icons-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/src/components/ui/sidebar"
import {SessionProvider, useSession} from "next-auth/react";
import UserAvatar from '@/src/components/user-avatar'
import {Skeleton} from '@/src/components/ui/skeleton'

export function NavUser() {
    const {isMobile} = useSidebar()
    const session = useSession()

    if (session.status === 'loading') return (
        <div className="p-2 h-12 w-full flex items-center gap-2">
            <Skeleton className="h-8 min-w-8 rounded-full"/>
            <div className="w-full flex flex-col gap-1">
                <Skeleton className="h-3 w-full"/>
                <Skeleton className="h-2 w-full"/>
            </div>
        </div>
    )

    if (!session.data?.user?.image) return null

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <SessionProvider>
                                <UserAvatar image={session.data.user.image}/>
                            </SessionProvider>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{session.data?.user.name}</span>
                                <span className="text-muted-foreground truncate text-xs">
                                  {session.data?.user.email}
                                </span>
                            </div>
                            <IconDotsVertical className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={session.data?.user.image}/>
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{session.data?.user.name}</span>
                                    <span className="text-muted-foreground truncate text-xs">
                                        {session.data?.user.email}
                                      </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <IconUserCircle/>
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <IconCreditCard/>
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <IconNotification/>
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <IconLogout/>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

'use client'

import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu'
import {signOut, useSession} from 'next-auth/react'
import Link from "next/link";
import UserAvatar from '@/src/components/user-avatar'
import {Skeleton} from '@/src/components/ui/skeleton'
import {Avatar, AvatarFallback, AvatarImage} from "@/src/components/ui/avatar";
import {Bell, CreditCard, LogOut, Settings, UserRound} from "lucide-react";

const UserLogo = () => {
    const session = useSession()

    if (session.status === 'loading') return <Skeleton className="h-8 w-8 rounded-full"/>

    if (!session.data?.user?.image) return null

    return (
        <div className="flex gap-2">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger >
                    <UserAvatar image={session.data.user.image}/>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
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
                            <UserRound />
                            Account
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/settings" className="flex gap-2">
                                <Settings/>
                                Settings
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => signOut()}>
                        <LogOut />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default UserLogo
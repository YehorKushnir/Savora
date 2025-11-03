'use client'

import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu'
import {signOut, useSession} from 'next-auth/react'
import Link from "next/link";
import UserAvatar from '@/src/components/user-avatar'
import {Skeleton} from '@/src/components/ui/skeleton'

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
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>
                        <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default UserLogo
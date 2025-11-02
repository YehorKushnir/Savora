'use client'

import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu'
import {Button} from '@/src/components/ui/button'
import {Avatar, AvatarFallback, AvatarImage} from '@/src/components/ui/avatar'
import {signOut, useSession} from 'next-auth/react'
import {Skeleton} from '@/src/components/ui/skeleton'
import Link from "next/link";

const UserLogo = () => {
    const session = useSession()

    if (session.status === 'loading') return <Skeleton className="h-8 w-8 rounded-full"/>

    if (!session.data) return null

    return (
        <div className="flex gap-2">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="default" className="w-8 h-8 p-0 rounded-full">
                        <Avatar>
                            <AvatarImage src={session.data.user?.image || ''}/>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </Button>
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
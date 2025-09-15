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
import {Session} from 'next-auth'
import {FC} from 'react'
import {signOut} from 'next-auth/react'

interface Props {
    session: Session
}

const UserLogoMenu:FC<Props> = ({session}) => {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="default" className="w-8 h-8 p-0 rounded-full">
                    <Avatar>
                        <AvatarImage src={session?.user?.image || ''}/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserLogoMenu
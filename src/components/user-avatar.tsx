'use client'

import {Avatar, AvatarFallback, AvatarImage} from '@/src/components/ui/avatar'
import {useSession} from 'next-auth/react'
import {Skeleton} from '@/src/components/ui/skeleton'

export default function UserAvatar() {
    const session = useSession()

    if (session.status === 'loading') return <Skeleton className="h-8 w-8 rounded-full"/>

    return (
        <Avatar>
            <AvatarImage src={session.data?.user?.image || ''}/>
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    )
}
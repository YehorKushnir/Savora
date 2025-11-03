'use client'

import {Avatar, AvatarFallback, AvatarImage} from '@/src/components/ui/avatar'

interface Props {
    image: string
}

export default function UserAvatar({image}: Props) {
    return (
        <Avatar>
            <AvatarImage src={image ?? ''}/>
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    )
}
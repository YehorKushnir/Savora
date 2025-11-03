"use client"

import Image from 'next/image'
import UserLogo from '@/src/components/user-logo'
import {Navigation} from '@/src/components/navigation'
import {SessionProvider} from 'next-auth/react'
import {Switch} from "@/src/components/ui/switch";
import {useNavbar} from "@/src/lib/stores/navbare-store";

const Header = () => {
    const {navbarState, toggleNavbar} = useNavbar()
    return (
        <div className="w-full h-12 flex items-center justify-between">
            <Image width={32} height={32} src={'/light.svg'} alt={'logo'}/>
            <Navigation/>
            <div className="flex gap-4 items-center">
                <Switch checked={navbarState} onCheckedChange={toggleNavbar} id="airplane-mode" className="scale-125 cursor-pointer" />
                <SessionProvider>
                    <UserLogo/>
                </SessionProvider>
            </div>
        </div>
    )
}

export default Header
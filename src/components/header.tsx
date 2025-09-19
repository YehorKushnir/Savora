import Image from 'next/image'
import UserLogo from '@/src/components/user-logo'
import {Navigation} from '@/src/components/navigation'
import {SessionProvider} from 'next-auth/react'

const Header = () => {
    return (
        <div className="w-full h-12 flex items-center justify-between">
            <Image width={32} height={32} src={'/light.svg'} alt={'logo'}/>
            <Navigation/>
            <SessionProvider>
                <UserLogo/>
            </SessionProvider>
        </div>
    )
}

export default Header
import Image from 'next/image'
import UserLogo from '@/src/components/user-logo'
import {Navigation} from '@/src/components/navigation'
import {Suspense} from 'react'
import {Skeleton} from '@/src/components/ui/skeleton'

const Header = () => {
    return (
        <div className="w-full h-12 flex items-center justify-between">
            <Image width={32} height={32} src={'/light.svg'} alt={'logo'}/>
            <Navigation/>
            <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full"/>}>
                <UserLogo/>
            </Suspense>
        </div>
    )
}

export default Header
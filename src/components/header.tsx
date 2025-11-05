import Image from 'next/image'
import UserLogo from '@/src/components/user-logo'
import {Navigation} from '@/src/components/navigation'
import {ToggleTheme} from "@/src/components/toggle-theme";
import {ToggleSidebar} from "@/src/components/toggle-sidebar";

const Header = () => {
    return (
        <div className="w-full h-12 flex items-center justify-between">
            <Image width={32} height={32} src={'/light.svg'} alt={'logo'}/>
            <Navigation/>
            <div className="flex gap-2 items-center">
                <ToggleTheme/>
                <ToggleSidebar/>
                <UserLogo/>
            </div>
        </div>
    )
}

export default Header
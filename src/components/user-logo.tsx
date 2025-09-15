import {auth} from '@/auth'
import UserLogoMenu from '@/src/components/user-logo-menu'

const UserLogo = async () => {
    const session = await auth()

    if (!session?.user) return null

    return (
        <div className="flex gap-2">
            <UserLogoMenu session={session} />
        </div>
    )
}

export default UserLogo
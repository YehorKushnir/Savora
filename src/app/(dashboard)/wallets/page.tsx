import WalletList from '@/src/components/wallet-list'

export default function Accounts() {
    return (
        <div className={'w-full flex'}>
            <WalletList/>
            <div className={'w-full flex flex-col items-center'}>
                Accounts
            </div>
        </div>
    )
}
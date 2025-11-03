import {Tabs, TabsList, TabsTrigger} from '@/src/components/ui/tabs'
import {useWallets} from "@/src/lib/stores/wallet-store";

const WalletOptions = () => {
    const type = useWallets((state) => state.type)
    const setType = useWallets((state) => state.setType)

    return (
        <>
            <Tabs value={type} onValueChange={setType}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="income">Incomes</TabsTrigger>
                    <TabsTrigger value="expense">Expenses</TabsTrigger>
                    <TabsTrigger value="transfer">Transfers</TabsTrigger>
                </TabsList>
            </Tabs>
        </>
    )
}

export default WalletOptions
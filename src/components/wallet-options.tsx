import {Tabs, TabsList, TabsTrigger} from '@/src/components/ui/tabs'
import {useTypeOptions} from "@/src/lib/stores/type-options-store";

const WalletOptions = () => {
    const type = useTypeOptions((state) => state.type)
    const setType = useTypeOptions((state) => state.setType)

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
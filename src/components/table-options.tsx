import {Tabs, TabsList, TabsTrigger} from '@/src/components/ui/tabs'
import {useTypeOptions} from "@/src/lib/stores/type-options-store";
import { useTranslations } from 'next-intl';

export const TableOptions = () => {
    const type = useTypeOptions((state) => state.type)
    const setType = useTypeOptions((state) => state.setType)
    const t = useTranslations('Transactions.filters');

    return (
        <Tabs value={type} onValueChange={setType}>
            <TabsList>
                <TabsTrigger value="all">{t('all')}</TabsTrigger>
                <TabsTrigger value="income">{t('income')}</TabsTrigger>
                <TabsTrigger value="expense">{t('expense')}</TabsTrigger>
                <TabsTrigger value="transfer">{t('transfer')}</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}

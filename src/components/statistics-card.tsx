"use client"

import {use} from "react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card"
import {getExpenseFunds} from "@/src/lib/helpers/get-expenses-funds";
import {getIncomeFunds} from "@/src/lib/helpers/get-incoming-funds";
import {useTimeRange} from "@/src/lib/stores/time-range-store";
import {filterTransactionsByDate} from "@/src/lib/helpers/filter-by-date";
import { PropsTransactionInterface } from "../lib/types/props-transaction-interface";
import { useTranslations } from 'next-intl';

export function StatisticCards(props: PropsTransactionInterface) {
    const data = use(props.transactions)
    const timeRange = useTimeRange(state => state.timeRange)
    const customRange = useTimeRange(state => state.customRange)
    const filteredData = filterTransactionsByDate(data, customRange ?  customRange : timeRange)
    const [incomeFunds] = getIncomeFunds(filteredData);
    const [expenseFunds] = getExpenseFunds(filteredData);
    const currency = '€'

    // Подключаем переводы
    const t = useTranslations('Statistics.cards');

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card gap-4 py-4">
                <CardHeader>
                    <CardDescription>{t('income')}</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex gap-1 items-center">
                        <span>{currency}</span>
                        <span>{incomeFunds}</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="@container/card gap-4 py-4">
                <CardHeader>
                    <CardDescription>{t('expense')}</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex gap-1 items-center">
                        <span>{currency}</span>
                        <span>{expenseFunds}</span>
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}
"use client"

import {use, useMemo} from "react";
import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/src/components/ui/card"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/src/components/ui/chart"
import {useTimeRange} from "@/src/lib/stores/time-range-store";
import { PropsTransactionInterface } from "../lib/types/props-transaction-interface"
import { useTranslations } from 'next-intl';

type ChartDataType = {
    date: string
    amount: number
}

export function StaticsChartFunds(props: PropsTransactionInterface) {
    const data = use(props.transactions)
    const t = useTranslations('Statistics.charts.funds');

    const chartConfig = useMemo(() => ({
        expense: {
            label: t('balance'),
            color: "var(--primary)",
        },
        income: {
            label: t('balance'),
            color: "var(--primary)",
        },
    } satisfies ChartConfig), [t])

    const timeRange = useTimeRange(state => state.timeRange)
    const timePhrase = useTimeRange(state => state.timePhrase)
    const fromDate = useTimeRange(state => state.fromDate)
    const toDate = useTimeRange(state => state.toDate)

    const baseRecords = useMemo(() => {
        const sortedAll = [...data].sort((a, b) =>
            new Date(a.executedAt).getTime() - new Date(b.executedAt).getTime()
        )

        const balances: Record<string, number> = {}
        const history: ChartDataType[] = []

        for (const tx of sortedAll) {
            for (const entry of tx.entries) {
                balances[entry.vaultId] = Number(entry.balanceAfter)
            }

            const total = Object.values(balances).reduce((sum, val) => sum + val, 0)
            const dateStr = new Date(tx.executedAt).toISOString().split('T')[0]

            const lastPoint = history[history.length - 1]
            if (lastPoint && lastPoint.date === dateStr) {
                lastPoint.amount = Math.round(total)
            } else {
                history.push({ date: dateStr, amount: Math.round(total) })
            }
        }

        const now = new Date()
        let startDate = new Date(0)
        let endDate = new Date()

        if (fromDate && toDate) {
            startDate = fromDate
            endDate = toDate
        }
        else if (timeRange !== "all") {
            const days = parseInt(timeRange)
            if (!isNaN(days)) {
                startDate = new Date()
                startDate.setDate(now.getDate() - days)
            }
        }

        return history.filter(item => {
            const d = new Date(item.date)
            d.setHours(0, 0, 0, 0)
            const start = new Date(startDate)
            start.setHours(0, 0, 0, 0)
            const end = new Date(endDate)
            end.setHours(23, 59, 59, 999)

            return d >= start && d <= end
        })

    }, [data, timeRange, fromDate, toDate])

    return (
        <Card className="@container/card pb-4">
            <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
                <CardDescription className="flex gap-2 flex-col">
                     <span className="hidden @[540px]/card:block">
                         {t('total_last', { period: timePhrase })}
                     </span>
                    <span className="@[540px]/card:hidden">
                        {t('last', { period: timePhrase })}
                    </span>
                    {baseRecords.length === 0 && (
                        <span>{t('no_data')}</span>
                    )}
                </CardDescription>
            </CardHeader>
            { baseRecords.length > 0
                ? <CardContent className="px-2 pt-4 sm:px-4">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[290px] w-full"
                    >
                        <AreaChart data={baseRecords}>
                            <defs>
                                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--primary)"
                                        stopOpacity={1.0}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--primary)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--primary)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--primary)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />
                            <YAxis
                                dataKey="amount"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => `${value} €`}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                type="natural"
                                dataKey="amount"
                                connectNulls
                                fill="url(#fillDesktop)"
                                stroke="var(--primary)"
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
                : null
            }
        </Card>
    )
}

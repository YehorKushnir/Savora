"use client"

import {use, useMemo} from "react";
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/src/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@/src/components/ui/chart";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {ClientWallet} from "@/src/lib/types/client-wallet-type";
import {useTimeRange} from "@/src/lib/stores/time-range-store";
import { useTranslations } from 'next-intl';

export type ChartRow = { date: string; [key: string]: number | string };

interface Props {
    wallets: Promise<ClientWallet[]>
}

export function StaticsChartWallets(props: Props) {
    const data = use(props.wallets)
    const timePhrase = useTimeRange(state => state.timePhrase)
    const t = useTranslations('Statistics.charts.wallets');

    const { chartData, chartConfig, walletKeys, maxKey } = useMemo(() => {
        if (!data || data.length === 0) {
            return { chartData: [], chartConfig: {}, walletKeys: [], maxKey: '' }
        }

        const assets = data.filter(w => w.type === 'asset')

        const row: ChartRow = { date: t('current') }
        const config: ChartConfig = {}
        const keys: string[] = []
        let maxVal = 0
        let maxK = ""

        assets.forEach((w, index) => {
            const key = w.name
            const bal = Number(w.balance)

            row[key] = bal
            keys.push(key)

            config[key] = {
                label: w.name,
                color: `var(--chart-${(index % 5) + 1})`
            }

            if (bal > maxVal) {
                maxVal = bal
                maxK = key
            }
        })

        return {
            chartData: [row],
            chartConfig: config,
            walletKeys: keys,
            maxKey: maxK
        }
    }, [data, t])

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('title')}</CardTitle>
                    <CardDescription>{t('no_data')}</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="@container/card pb-4">
            <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
                <CardDescription>
                <span className="hidden @[540px]/card:block">
                    {t('current_dist')}
                </span>
                    <span className="@[540px]/card:hidden">{t('current')}</span>
                </CardDescription>
                <CardAction className="flex gap-4">
                </CardAction>
            </CardHeader>
            <CardContent className="px-4 pt-4">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[290px] w-full"
                >
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                        />
                        <YAxis
                            dataKey={maxKey}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={16}
                            tickFormatter={(value) => `${value} €`}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent/>}
                        />
                        <ChartLegend content={<ChartLegendContent />} className="grid-cols-2 grid md:grid-cols-3"/>
                        {walletKeys.map((k) => (
                            <Bar key={k} dataKey={k} fill={chartConfig[k]?.color} radius={4} id={k} />
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
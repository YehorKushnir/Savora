"use client"

import {Transaction} from "@/src/lib/types/transactions";
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
import {useTimeRange} from "@/src/lib/stores/time-range-store";
import {cleanLabel} from "@/src/lib/helpers/clean-label";
import {filterTransactionsByDate} from "@/src/lib/helpers/filter-by-date";

export type ChartRow = { date: string; [key: string]: number | string };

export type ChartDataType = ChartRow[];

export function StaticsChartCategory({ data = [] }: { data?: Transaction[] }) {
    const {timeRange, timePhrase, customRange} = useTimeRange()
    const totals: Record<string, number> = {};
    const filteredData = filterTransactionsByDate(data, customRange ?  customRange : timeRange)

    if (!filteredData || filteredData.length === 0) {
        return (
            <Card className="@container/card pb-4">
                <CardHeader>
                    <CardTitle>Largest expenditures by category</CardTitle>
                    <CardDescription className="flex gap-2 flex-col">
                         <span className="hidden @[540px]/card:block">
                            Total for the last {timePhrase}
                         </span>
                        <span className="@[540px]/card:hidden">Last {timePhrase}</span>
                        <span>
                              No data available for the selected range.
                        </span>
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    for (const transaction of filteredData) {
      for (const entries of transaction.entries) {
        if (entries.vaultId === "seed_vault_card" || entries.vaultId.includes("income")) continue;
        const amount = Number(entries.amount ?? 0);
        totals[entries.vaultId] = (totals[entries.vaultId] ?? 0) + (isFinite(amount) ? amount : 0);
      }
    }

    const categoryKeys = Object.keys(totals);

    const chartData: ChartDataType = [
      { date: "Total", ...totals }
    ];

    const dynamicChartConfig: ChartConfig = categoryKeys.reduce((acc, key, i) => {
        acc[key] = {
            label: cleanLabel(key),
            color: `var(--chart-${(i % 12) + 1})`,
        } as any;
        return acc;
    }, {} as ChartConfig);

    const maxKey = Object.keys(totals).reduce((a, b) =>
        totals[a] > totals[b] ? a : b
    )

    return (
        <Card className="@container/card pb-4">
            <CardHeader>
                <CardTitle>Largest expenditures by category</CardTitle>
                <CardDescription>
                <span className="hidden @[540px]/card:block">
                    Total for the last {timePhrase}
                </span>
                    <span className="@[540px]/card:hidden">Last {timePhrase}</span>
                </CardDescription>
                <CardAction className="flex gap-4">
                </CardAction>
            </CardHeader>
            <CardContent className="px-4 pt-4">
                <ChartContainer
                    config={dynamicChartConfig}
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
                        {categoryKeys.map((k) => (
                            <Bar key={k} dataKey={k} fill={dynamicChartConfig[k].color} radius={4} id={k} />
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
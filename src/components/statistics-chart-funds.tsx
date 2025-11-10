"use client"

import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/src/components/ui/card"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/src/components/ui/chart"
import {Transaction} from "@/src/lib/types/transactions"
import {useTimeRange} from "@/src/lib/stores/time-range-store";
import {filterTransactionsByDate} from "@/src/lib/helpers/filter-by-date";

type ChartDataType = {
    date: string
    amount: number
}

const chartConfig = {
    expense: {
        label: "Balance",
        color: "var(--primary)",
    },
    income: {
        label: "Balance",
        color: "var(--primary)",
    },
} satisfies ChartConfig

export function StaticsChartFunds({ data = [] }: { data?: Transaction[] }) {
    const {timeRange, timePhrase, customRange} =  useTimeRange()
    const filteredData = filterTransactionsByDate(data, customRange ?  customRange : timeRange)

    const baseRecords: ChartDataType[] = filteredData
        .map((item) => {
            const cardEntry = item.entries?.find((e) => e.vaultId === "seed_vault_card")
            if (!cardEntry) return null
            const dateOnly = item.executedAt.split("T")[0]
            const after = cardEntry.balanceAfter ? cardEntry.balanceAfter : 0
            const amount = Math.round(after)
            return {
                date: dateOnly,
                amount,
            }
        })
        .filter((x): x is ChartDataType => Boolean(x))
        .sort((a, b) => a.date.localeCompare(b.date))

    return (
        <Card className="@container/card pb-4">
            <CardHeader>
                <CardTitle>Total Funds</CardTitle>
                <CardDescription>
                <span className="hidden @[540px]/card:block">
                    Total for the last {timePhrase}
                </span>
                <span className="@[540px]/card:hidden">Last {timePhrase}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-4">
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
        </Card>
    )
}

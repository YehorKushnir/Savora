import {StatisticCards} from "@/src/components/statistics-card";
import {StaticsChartFunds} from "@/src/components/statistics-chart-funds";
import {getTransactions} from "@/src/app/[locale]/(dashboard)/transactions/actions";
import {StaticsChartWallets} from "@/src/components/statistics-chart-wallets";
import {StatisticsSelectTimeRange} from "@/src/components/statistics-select-time-range";
import {StatisticsChoosingWallet} from "@/src/components/statistics-choosing-wallet";
import {getWallets} from '@/src/app/[locale]/(dashboard)/wallets/actions'
import {Skeleton} from "@/src/components/ui/skeleton";
import { Suspense } from "react";

export default async function Statistics() {
    const transactions = getTransactions()
    const wallets = getWallets()
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2 pb-2">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 justify-end">
                        <StatisticsChoosingWallet wallets={wallets}/>
                        <StatisticsSelectTimeRange/>
                    </div>
                    <Suspense fallback={<Skeleton className={'w-full h-[900px]'}/>}>
                        <StatisticCards transactions={transactions} />
                        <StaticsChartFunds transactions={transactions} />
                        <StaticsChartWallets wallets={wallets}/>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
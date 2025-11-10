import {StatisticCards} from "@/src/components/statistics-card";
import {StaticsChartFunds} from "@/src/components/statistics-chart-funds";
import {getTransactions} from "@/src/app/(dashboard)/actions";
import {StaticsChartCategory} from "@/src/components/statistics-chart-category";
import {StatisticsSelectTimeRange} from "@/src/components/statistics-select-time-range";

export default async function Statistics() {
    const transactions = await getTransactions()
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2 pb-2">
                <div className="flex flex-col gap-4">
                    <StatisticsSelectTimeRange/>
                    <StatisticCards data={transactions} />
                    <StaticsChartFunds data={transactions} />
                    <StaticsChartCategory data={transactions}/>
                </div>
            </div>
        </div>
    )
}
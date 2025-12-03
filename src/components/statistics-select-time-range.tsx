'use client'

import {ToggleGroup, ToggleGroupItem} from "@/src/components/ui/toggle-group";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";
import {useTimeRange} from "@/src/lib/stores/time-range-store";
import {useEffect} from "react";
import {useIsMobile} from "@/src/hooks/use-mobile";
import {SelectCalendar} from "@/src/components/select-calendar";
import {useSearchParams} from "next/navigation";
import {updateTimeRangeParams} from "@/src/lib/helpers/update-active-wallet";
import { useTranslations } from 'next-intl';

export const StatisticsSelectTimeRange = () => {
    const isMobile = useIsMobile()
    const searchParams = useSearchParams()
    const timeRangePath = searchParams.get("timeRange")
    const fromDatePath = searchParams.get("fromDate")
    const toDatePath = searchParams.get("toDate")
    const timeRange = useTimeRange((state) => state.timeRange);
    const setFromOpen = useTimeRange((state) => state.setFromOpen);
    const setToOpen = useTimeRange((state) => state.setToOpen);
    const openFrom = useTimeRange((state) => state.openFrom);
    const openTo = useTimeRange((state) => state.openTo);
    const fromDate = useTimeRange((state) => state.fromDate);
    const toDate = useTimeRange((state) => state.toDate);
    const setToDate = useTimeRange((state) => state.setToDate);
    const setFromDate = useTimeRange((state) => state.setFromDate);
    const setRange = useTimeRange((state) => state.setRange);

    const t = useTranslations('Statistics.filters');

    function applyDateChanges(newFrom: Date | undefined, newTo: Date | undefined) {
        if (newFrom && newTo) {
            setRange({fromDate: newFrom, toDate: newTo});

            const now = new Date();
            const validToDate = newTo > now ? now : newTo;
            const diff = Math.ceil((validToDate.getTime() - newFrom.getTime()) / (1000 * 60 * 60 * 24));

            if (diff) {
                updateTimeRangeParams(diff.toString(), searchParams, newFrom, newTo);
            }
        }
    }

    useEffect(() => {
        if (isMobile && !timeRangePath) {
            setRange({range: "7"})
        }
    }, [isMobile])

    useEffect(() => {
        if(!timeRangePath && !fromDatePath && !toDatePath) {
            updateTimeRangeParams(timeRange, searchParams);
        }else if(toDatePath && fromDatePath){
            const toDate = new Date(toDatePath);
            const fromDate = new Date(fromDatePath)
            setToDate(toDate)
            setFromDate(fromDate)
            setRange({fromDate, toDate})
        }else if (timeRangePath) {
            setRange({range: timeRangePath})
        }
    }, []);

    return (
        <div className="flex flex-col justify-end gap-4 @[765px]:flex-row">
            <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={(value) => {
                    if(value !== "" && value !== "custom") {
                        setRange({range: value})
                        updateTimeRangeParams(value, searchParams);
                    }else if (value === "custom") {
                        setRange({fromDate,toDate})
                        updateTimeRangeParams(value, searchParams, fromDate, toDate);
                    }
                }}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:!px-4 @[765px]:flex"
            >
                <ToggleGroupItem value="90">{t('last_90_days')}</ToggleGroupItem>
                <ToggleGroupItem value="30">{t('last_30_days')}</ToggleGroupItem>
                <ToggleGroupItem value="7">{t('last_7_days')}</ToggleGroupItem>
                <ToggleGroupItem value="custom"
                                 disabled={(!fromDate || !toDate)}
                >
                    {t('custom')}
                </ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange}
                    onValueChange={(value) => {
                        setRange({range: value})
                        updateTimeRangeParams(value, searchParams);
                    }}>
                <SelectTrigger
                    className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[765px]:hidden"
                    size="sm"
                    aria-label="Select a value"
                >
                    <SelectValue placeholder={t('last_30_days')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                    <SelectItem value="90" className="rounded-lg">
                        {t('last_90_days')}
                    </SelectItem>
                    <SelectItem value="30" className="rounded-lg">
                        {t('last_30_days')}
                    </SelectItem>
                    <SelectItem value="7" className="rounded-lg">
                        {t('last_7_days')}
                    </SelectItem>
                    <SelectItem value="custom" className="rounded-lg">
                        {t('custom')}
                    </SelectItem>
                </SelectContent>
            </Select>

            <SelectCalendar
                open={openFrom}
                setOpen={setFromOpen}
                date={fromDate}
                setDate={(date) => {
                    if ( date && toDate && date.getTime() <= toDate.getTime()) {
                        setFromDate(date);
                        applyDateChanges(date, toDate);
                  }
                }}
            />

            <SelectCalendar
                open={openTo}
                setOpen={setToOpen}
                date={toDate}
                setDate={(date) => {
                    if ( date && toDate && date.getTime() <= toDate.getTime()) {
                        setToDate(date);
                        applyDateChanges(fromDate, date);
                    }
                }}
            />
        </div>
    )
}
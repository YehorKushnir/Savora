"use client"

import {ToggleGroup, ToggleGroupItem} from "@/src/components/ui/toggle-group";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";
import {useTimeRange} from "@/src/lib/stores/time-range-store";
import {useEffect} from "react";
import {useIsMobile} from "@/src/hooks/use-mobile";
import {SelectCalendar} from "@/src/components/select-calendar";
import {Button} from "@/src/components/ui/button";

export const StatisticsSelectTimeRange = () => {
    const isMobile = useIsMobile()
    const {timeRange,setTimeRange, setFromOpen, setToOpen, openFrom,openTo, fromDate, toDate, setToDate, setFromDate, setCustom} = useTimeRange();

    useEffect(() => {
        if (isMobile) {
            setTimeRange("7")
        }
    }, [isMobile])

    return (
        <div className="flex flex-col justify-end gap-4 @[765px]:flex-row">
            <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={setTimeRange}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:!px-4 @[765px]:flex"
            >
                <ToggleGroupItem value="90">Last 3 months</ToggleGroupItem>
                <ToggleGroupItem value="30">Last 30 days</ToggleGroupItem>
                <ToggleGroupItem value="7">Last 7 days</ToggleGroupItem>
                <ToggleGroupItem value="custom"
                                 disabled={(!fromDate || !toDate)}
                >
                    Custom
                </ToggleGroupItem>
            </ToggleGroup>
            <SelectCalendar open={openFrom} setOpen={setFromOpen} setDate={setFromDate} date={fromDate}/>
            <SelectCalendar open={openTo} setOpen={setToOpen} setDate={setToDate} date={toDate}/>
            <Button variant="outline"
                disabled={(!fromDate || !toDate)}
                onClick={() => setCustom(fromDate,toDate)}>
                Apply
            </Button>
            <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                    className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[765px]:hidden"
                    size="sm"
                    aria-label="Select a value"
                >
                    <SelectValue placeholder="Last 3 months" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                    <SelectItem value="90" className="rounded-lg">
                        Last 3 months
                    </SelectItem>
                    <SelectItem value="30" className="rounded-lg">
                        Last 30 days
                    </SelectItem>
                    <SelectItem value="7" className="rounded-lg">
                        Last 7 days
                    </SelectItem>
                    <SelectItem value="custom" className="rounded-lg">
                        Custom
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
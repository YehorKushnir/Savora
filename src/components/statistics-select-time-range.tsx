'use client'

import {ToggleGroup, ToggleGroupItem} from "@/src/components/ui/toggle-group";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";
import {useTimeRange} from "@/src/lib/stores/time-range-store";
import {useEffect} from "react";
import {useIsMobile} from "@/src/hooks/use-mobile";
import {SelectCalendar} from "@/src/components/select-calendar";
import {Button} from "@/src/components/ui/button";
import {useSearchParams} from "next/navigation";
import {updateTimeRangeParams} from "@/src/lib/helpers/update-active-wallet";

export const StatisticsSelectTimeRange = () => {
    const isMobile = useIsMobile()
    const searchParams = useSearchParams()
    const timeRangePath = searchParams.get("timeRange")
    const fromDatePath = searchParams.get("fromDate")
    const toDatePath = searchParams.get("toDate")
    const {timeRange, setFromOpen, setToOpen, openFrom,openTo, fromDate, toDate, setToDate, setFromDate, setRange} = useTimeRange();

    function dateConversion() {
        if (fromDate && toDate) {
            const now = new Date();
            const validToDate = toDate > now ? now : toDate;
            return  Math.ceil((validToDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
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
                <ToggleGroupItem value="90">Last 3 months</ToggleGroupItem>
                <ToggleGroupItem value="30">Last 30 days</ToggleGroupItem>
                <ToggleGroupItem value="7">Last 7 days</ToggleGroupItem>
                <ToggleGroupItem value="custom"
                                 disabled={(!fromDate || !toDate)}
                >
                    Custom
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
            <SelectCalendar open={openFrom} setOpen={setFromOpen} setDate={setFromDate} date={fromDate}/>
            <SelectCalendar open={openTo} setOpen={setToOpen} setDate={setToDate} date={toDate}/>
            <Button variant="outline"
                disabled={(!fromDate || !toDate)}
                onClick={() => {
                    setRange({fromDate,toDate})
                    const diff = dateConversion()
                    if(diff) {
                        updateTimeRangeParams(diff.toString(), searchParams, fromDate, toDate)
                    }
                }}>
                Apply
            </Button>
        </div>
    )
}
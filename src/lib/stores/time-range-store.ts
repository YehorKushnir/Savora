import {create} from "zustand";
import { devtools } from "zustand/middleware";

interface State {
    timeRange: string
    customRange: string | undefined
    setTimeRange: (timeRange: string) => void
    timePhrase: string
    openFrom: boolean;
    openTo: boolean;
    fromDate: Date | undefined;
    toDate: Date | undefined;
    setFromOpen: (value: boolean) => void;
    setToOpen: (value: boolean) => void;
    setFromDate: (date: Date | undefined) => void;
    setToDate: (date: Date | undefined) => void;
    setCustom: (fromDate: Date | undefined, toDate: Date | undefined) => void;
}

export  const useTimeRange = create<State>()(devtools((set) => ({
    timeRange: "90",
    timePhrase: "3 months",
    fromDate: undefined,
    toDate: undefined,
    openFrom: false,
    openTo: false,
    customRange: undefined,
    setTimeRange: (newTimeRange) => {
        let timePhrase: State["timePhrase"];
        const {fromDate, toDate,setCustom, timeRange} = useTimeRange.getState();
        if(timeRange === "custom" && newTimeRange === "custom") {
            setCustom(fromDate, toDate);
            return;
        }
        switch (newTimeRange) {
            case "90":
                timePhrase = "3 months";
                break;
            case "30":
                timePhrase = "month";
                break;
            case "7":
                timePhrase = "7 days";
                break;
            default:
                timePhrase = "3 months";
        }
        set({ timeRange:newTimeRange, timePhrase, customRange: undefined });
    },
    setFromOpen: (value) => set({ openFrom: value }),
    setToOpen: (value) => set({ openTo: value }),
    setFromDate: (date) => set({ fromDate: date }),
    setToDate: (date) => set({ toDate: date }),
    setCustom: (fromDate, toDate) => {
        if (fromDate && toDate) {
            const now = new Date();
            const validToDate = toDate > now ? now : toDate;
            const diff = Math.ceil((validToDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
            set({
                timeRange: "custom",
                timePhrase: `${diff} days`,
                customRange: diff.toString(),
                fromDate,
                toDate
            });
        } else {
            set({ timeRange: "custom", timePhrase: "custom range", fromDate, toDate });
        }
    },
}), {name: "TimeRangeStore"}));
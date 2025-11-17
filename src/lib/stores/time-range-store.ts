import {create} from "zustand";

interface State {
    timeRange: string
    customRange: string | undefined
    timePhrase: string
    openFrom: boolean;
    openTo: boolean;
    fromDate: Date | undefined;
    toDate: Date | undefined;
    setFromOpen: (value: boolean) => void;
    setToOpen: (value: boolean) => void;
    setFromDate: (date: Date | undefined) => void;
    setToDate: (date: Date | undefined) => void;
    setRange: (params: { fromDate?: Date | undefined, toDate?: Date | undefined, range?: string }) => void;
}

export  const useTimeRange = create<State>((set) => ({
    timeRange: "30",
    timePhrase: "30 days",
    fromDate: undefined,
    toDate: undefined,
    openFrom: false,
    openTo: false,
    customRange: undefined,
    setFromOpen: (value) => set({ openFrom: value }),
    setToOpen: (value) => set({ openTo: value }),
    setFromDate: (date) => set({ fromDate: date }),
    setToDate: (date) => set({ toDate: date }),
    setRange: ({ fromDate, toDate, range }) => {
        if (fromDate && toDate) {
            const now = new Date();
            const validToDate = toDate > now ? now : toDate;
            const diff = Math.floor((validToDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
            set({
                timeRange: "custom",
                timePhrase: `${diff} days`,
                customRange: diff.toString(),
                fromDate,
                toDate
            });
        } else if (range){
            const now = new Date();
            const toDate = now;
            const fromDate = new Date(now);
            fromDate.setDate(now.getDate() - Number(range));
            set({
                timeRange: range,
                timePhrase: `${range} days`,
                customRange: range,
                fromDate,
                toDate
            });
        } else{
            set({ timeRange: "custom", timePhrase: "custom range", fromDate, toDate });
        }
    },
}))
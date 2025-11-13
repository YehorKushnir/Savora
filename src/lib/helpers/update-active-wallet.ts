import {ReadonlyURLSearchParams} from "next/navigation";

const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

export function updateTimeRangeParams(value: string, searchParams: ReadonlyURLSearchParams, fromDate?: Date, toDate?: Date,) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("timeRange", value);
    if (fromDate && toDate) {
        params.set("fromDate", formatDate(fromDate));
        params.set("toDate", formatDate(toDate));
        params.delete("timeRange");
    }else {
        params.delete("fromDate");
        params.delete("toDate");
    }

    window.history.replaceState(null, "", `?${params.toString()}`);
}
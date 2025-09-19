"use client";
import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 640) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") return

        const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)

        const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)

        setIsMobile(mql.matches)

        mql.addEventListener("change", onChange)
        return () => mql.removeEventListener("change", onChange)
    }, [breakpoint])

    return isMobile
}
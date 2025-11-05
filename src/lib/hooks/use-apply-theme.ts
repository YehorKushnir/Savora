import {useEffect} from "react";
import {useTheme} from "@/src/lib/stores/theme-store";

export const useApplyTheme = () => {
    const {theme} = useTheme();

    useEffect(() => {
        const root = document.documentElement;
        document.cookie = `theme=${theme}; path=/; max-age=31536000`
        const isDark = theme === "dark";
        root.classList.toggle('dark', isDark);
        try { localStorage.setItem("theme", theme); } catch {}
    }, [theme]);
}
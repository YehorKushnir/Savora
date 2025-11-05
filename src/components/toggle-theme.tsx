"use client"

import {useTheme} from "@/src/lib/stores/theme-store";
import {Moon, Sun} from "lucide-react";
import {useEffect} from "react";

export const ToggleTheme = () => {
    const {theme, toggleTheme} = useTheme();


    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return (
        <div onClick={toggleTheme} className="cursor-pointer active:scale-90 transition-transform duration-150">
            {theme === 'light'
                ? <Sun className="w-5 h-5"/>
                : <Moon className="w-5 h-5"/>
            }
        </div>
    )
}
"use client"

import {Separator} from "@/src/components/ui/separator";
import {ToggleSidebar} from "@/src/components/toggle-sidebar";
import {Tabs, TabsList, TabsTrigger} from "@/src/components/ui/tabs";
import {ToggleTheme} from "@/src/components/toggle-theme";
import {useSidebarStore} from "@/src/lib/stores/navbare-store";
import {useTheme} from "next-themes";

export function AppearanceContent() {
    const {type, toggleType, hydrated} = useSidebarStore()
    const { setTheme, theme} = useTheme()
    console.log(theme);
    if (!hydrated) return null
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-medium">Appearance</h1>
            <Separator/>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <ToggleSidebar disabled={true} />
                    <h2 className="text-sm text-left">Sidebar / Navbar</h2>
                </div>
                <Tabs defaultValue={type}>
                    <TabsList>
                        <TabsTrigger value="full" onClick={() => toggleType()}>Sidebar</TabsTrigger>
                        <TabsTrigger value="fixed" onClick={() => toggleType()}>Navbar</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <ToggleTheme disabled={true} />
                    <h2 className="text-sm text-left">Change Theme</h2>
                </div>
                <Tabs  defaultValue={theme}>
                    <TabsList>
                        <TabsTrigger value="light" onClick={() => setTheme("light")}>Light</TabsTrigger>
                        <TabsTrigger value="dark" onClick={() => setTheme("dark")}>Dark</TabsTrigger>
                        <TabsTrigger value="system" onClick={() => setTheme("system")}>System</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    )
}
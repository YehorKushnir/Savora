"use client"

import {Separator} from "@/src/components/ui/separator";
import {ToggleSidebar} from "@/src/components/toggle-sidebar";
import {Tabs, TabsList, TabsTrigger} from "@/src/components/ui/tabs";
import {ToggleTheme} from "@/src/components/toggle-theme";
import {useSidebarStore} from "@/src/lib/stores/navbare-store";
import {useTheme} from "next-themes";
import { useTranslations } from 'next-intl';

export function AppearanceContent() {
    const {type, toggleType, hydrated} = useSidebarStore()
    const { setTheme, theme} = useTheme()
    const t = useTranslations('Settings');

    if (!hydrated) return null
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-medium">{t('titles.appearance')}</h1>
            <Separator/>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <ToggleSidebar disabled={true} />
                    <h2 className="text-sm text-left">{t('appearance.sidebar_label')}</h2>
                </div>
                <Tabs defaultValue={type}>
                    <TabsList>
                        <TabsTrigger value="full" onClick={() => toggleType()}>{t('appearance.sidebar_option')}</TabsTrigger>
                        <TabsTrigger value="fixed" onClick={() => toggleType()}>{t('appearance.navbar_option')}</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <ToggleTheme disabled={true} />
                    <h2 className="text-sm text-left">{t('appearance.theme_label')}</h2>
                </div>
                <Tabs  defaultValue={theme}>
                    <TabsList>
                        <TabsTrigger value="light" onClick={() => setTheme("light")}>{t('appearance.theme_light')}</TabsTrigger>
                        <TabsTrigger value="dark" onClick={() => setTheme("dark")}>{t('appearance.theme_dark')}</TabsTrigger>
                        <TabsTrigger value="system" onClick={() => setTheme("system")}>{t('appearance.theme_system')}</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    )
}
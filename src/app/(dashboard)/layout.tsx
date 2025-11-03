"use client"

import Header from '@/src/components/header'
import {CSSProperties, ReactNode} from "react";
import {SidebarInset, SidebarProvider} from "@/src/components/ui/sidebar";
import {AppSidebar} from "@/src/components/app-sidebar";
import {useNavbar} from "@/src/lib/stores/navbare-store";
import {SiteHeader} from "@/src/components/site-header";

export default function RootLayout({children,}: Readonly<{ children: ReactNode }>
) {
    const {navbarState, isHydrated} = useNavbar();

    if (!isHydrated) {
        return (
            <div className="grid min-h-dvh place-items-center bg-background">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Loading…</span>
                </div>
            </div>
        )
    }

    return (
        <>
            {navbarState ?
                <div className="max-w-[1200] my-0 mx-auto flex flex-col gap-3 px-3">
                    <Header/>
                    <div className="w-full">
                        {children}
                    </div>
                </div>
             :
                <SidebarProvider
                    style={
                        {
                            "--sidebar-width": "calc(var(--spacing) * 60)",
                            "--header-height": "calc(var(--spacing) * 12)",
                        } as CSSProperties
                    }
                >
                    <AppSidebar variant="floating"/>
                    <SidebarInset className="flex flex-col gap-4 px-4">
                        <SiteHeader />
                        <div className="w-full">
                            {children}
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            }
        </>
    )
}

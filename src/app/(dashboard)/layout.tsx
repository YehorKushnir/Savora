"use client"

import Header from '@/src/components/header'
import {CSSProperties, ReactNode} from "react";
import {SidebarInset, SidebarProvider} from "@/src/components/ui/sidebar";
import {AppSidebar} from "@/src/components/app-sidebar";
import {SiteHeader} from "@/src/components/site-header";
import {SessionProvider} from 'next-auth/react'
import {useSidebarStore} from '@/src/lib/stores/navbare-store'

export default function RootLayout({children,}: Readonly<{ children: ReactNode }>
) {
    const {isOpen, type, setOpen, hydrated} = useSidebarStore()

    if (!hydrated) return null

    return (
        <SessionProvider>
            {type === 'fixed' ?
                (
                    <div className="max-w-[1200] my-0 mx-auto flex flex-col gap-5 px-3">
                        <Header/>
                        <div className="w-full">
                            {children}
                        </div>
                    </div>
                ) : (
                    <SidebarProvider
                        open={isOpen}
                        onOpenChange={setOpen}
                        style={
                            {
                                "--sidebar-width": "calc(var(--spacing) * 60)",
                                "--header-height": "calc(var(--spacing) * 12)",
                            } as CSSProperties
                        }
                    >
                        <AppSidebar variant="floating"/>
                        <SidebarInset className="flex flex-col gap-5 px-4">
                            <SiteHeader/>
                            <div className="w-full">
                                {children}
                            </div>
                        </SidebarInset>
                    </SidebarProvider>
                )
            }
        </SessionProvider>
    )
}

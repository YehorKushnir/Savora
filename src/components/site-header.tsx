import { Separator } from "@/src/components/ui/separator"
import { SidebarTrigger } from "@/src/components/ui/sidebar"
import {usePathname} from "next/navigation";
import {ToggleSidebar} from "@/src/components/toggle-sidebar";
import {ToggleTheme} from "@/src/components/toggle-theme";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/src/components/ui/breadcrumb";
import Link from "next/link";
import {Fragment} from "react";

export function SiteHeader() {
    const pathname = usePathname() || "/"
    const segments = pathname
        .split('/')
        .filter(Boolean)
        .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1">
                <SidebarTrigger/>
                <Separator
                    orientation="vertical"
                    className="ml-1 mr-4 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        {segments.map((item, index) => (
                            <Fragment key={index}>
                                <BreadcrumbItem>
                                    {item}
                                </BreadcrumbItem>
                                {index < segments.length - 1 && (
                                    <BreadcrumbSeparator/>
                                )}
                            </Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto flex items-center gap-1">
                    <ToggleTheme/>
                    <ToggleSidebar/>
                </div>
            </div>
        </header>
    )
}

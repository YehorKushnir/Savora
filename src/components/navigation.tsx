"use client"

import Link from "next/link"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/src/components/ui/navigation-menu"
import {usePathname} from "next/navigation";
import {navigation} from "@/src/lib/navigation";
import {cn} from "@/src/lib/utils";

export function Navigation() {
    const pathname = usePathname()

    return (
        <NavigationMenu viewport={true}>
            <NavigationMenuList>
                {navigation.map(item => (
                    <NavigationMenuItem key={item.url}>
                        <NavigationMenuLink
                            asChild
                            className={cn(navigationMenuTriggerStyle(), pathname === item.url ? 'bg-secondary' : 'bg-background')}
                        >
                            <Link href={item.url}>{item.title}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

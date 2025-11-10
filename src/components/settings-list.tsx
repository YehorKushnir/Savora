"use client"
import Link from "next/link";
import { usePathname } from "next/navigation"
import {SECTIONS} from "@/src/lib/helpers/sections";


export function SettingsList() {
  const pathname = usePathname()
    return (
        <nav className="min-w-[220px]">
            <ul className="space-y-2">
                {SECTIONS.map(({ slug, label, icon: Icon }) => {
                    const isActive = pathname === `/settings/${slug}`
                    const className = isActive
                        ? "bg-muted font-medium"
                        : "hover:bg-muted/60"
                    return (
                        <li key={slug}>
                            <Link
                                href={`/settings/${slug}`}
                                className={`flex gap-2 items-center rounded-md p-3 text-sm transition ${className}`}
                            >
                                {Icon && <Icon className="h-5 w-5"/>}
                                <span>{label}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
"use client"

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import {updateUserLocale} from "@/src/app/[locale]/(selection)/actions";
import { Globe } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

export function ToggleLanguage() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleSwitch = (newLocale: string) => {
        if (newLocale === locale) return;

        const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
        const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

        startTransition(async () => {
            await updateUserLocale(newLocale);
            router.replace(newPath);
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isPending}>
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => handleSwitch('en')}
                    className={locale === 'en' ? "bg-accent" : ""}
                >
                    English
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleSwitch('ru')}
                    className={locale === 'ru' ? "bg-accent" : ""}
                >
                    Русский
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleSwitch('uk')}
                    className={locale === 'uk' ? "bg-accent" : ""}
                >
                    Українська
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
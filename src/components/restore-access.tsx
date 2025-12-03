'use client'

import { useEffect } from 'react'
import {restoreUserAccess} from "@/src/app/[locale]/(selection)/actions";
import { Loader2 } from 'lucide-react'

export function RestoreAccess({ locale }: { locale: string }) {
    useEffect(() => {
        restoreUserAccess(locale);
    }, [locale]);

    return (
        <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Syncing your profile...</p>
        </div>
    )
}
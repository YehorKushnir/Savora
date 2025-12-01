import {Separator} from "@/src/components/ui/separator";
import { useTranslations } from 'next-intl';

export function AccountContent() {
    const t = useTranslations('Settings');

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold">{t('titles.account')}</h1>
            <Separator/>
            <p className="text-sm text-muted-foreground">....</p>
        </div>
    )
}
import {SectionSlug} from "@/src/lib/types/settings-slug";
import {AppearanceContent} from "@/src/components/settings-content-appearance";
import {AccountContent} from "@/src/components/settings-content-account";
import {Separator} from "@radix-ui/react-menu";
import {Skeleton} from "@/src/components/ui/skeleton";
import { useTranslations } from 'next-intl';

export function SettingsContent({ active }: { active: SectionSlug }) {
    const t = useTranslations('Settings');

    switch (active) {
        case "appearance":
            return <AppearanceContent />
        case "account":
            return <AccountContent />
        default:
            return (
                <div className="flex flex-col gap-4">
                    <h1 className="text-lg font-semibold">{t('titles.not_found')}</h1>
                    <Separator/>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            )
    }
}
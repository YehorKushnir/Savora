import { SettingsList } from '@/src/components/settings-list';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Separator } from '@radix-ui/react-dropdown-menu';
import {ReactNode, Suspense} from "react";

function SettingsLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-[150px]" />
            <Separator />
            <div className="space-y-4">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-10 w-full max-w-md" />
                <Skeleton className="h-10 w-full max-w-md" />
            </div>
        </div>
    );
}

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="w-full">
            <div className="flex gap-4 rounded-lg">
                <SettingsList />
                <div className="flex-1 rounded-lg">
                    <Suspense fallback={<SettingsLoadingSkeleton />}>
                        {children}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
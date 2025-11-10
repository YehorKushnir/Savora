import { SettingsList } from '@/src/components/settings-list';
import {ReactNode} from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="w-full">
            <div className="flex gap-4 rounded-lg">
                <SettingsList />
                <div className="flex-1 rounded-lg">{children}</div>
            </div>
        </div>
    );
}
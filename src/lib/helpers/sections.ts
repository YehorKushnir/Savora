import {Brush, LucideIcon, Settings} from "lucide-react";
import {SectionSlug} from "@/src/lib/types/settings-slug";

export interface SectionItem {
    slug: SectionSlug;
    label: string;
    icon?: LucideIcon;
}

export const SECTIONS: SectionItem[]  = [
    { slug: "account", label: "Account", icon: Settings },
    { slug: "appearance", label: "Appearance", icon: Brush },
] as const;
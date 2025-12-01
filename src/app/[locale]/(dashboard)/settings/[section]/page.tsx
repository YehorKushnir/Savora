import { SettingsContent } from '@/src/components/settings-content';
import { SectionSlug } from '@/src/lib/types/settings-slug';
import {SECTIONS} from "@/src/lib/helpers/sections";

export default async function Page ({ params }: { params: Promise<{ section: SectionSlug }> }) {
    const {section} = await params
    const active = SECTIONS.some(item => item.slug === section) ? section : '404'
    return <SettingsContent active={active} />
}
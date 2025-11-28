import {icons} from "lucide-react";

export type IconName = keyof typeof icons

export type IconPickerProps = {
    value: IconName
    onIconChange: (name: IconName) => void
};
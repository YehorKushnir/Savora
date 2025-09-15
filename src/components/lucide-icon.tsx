import * as Icons from "lucide-react";
import type {LucideProps} from "lucide-react";
import React, {FC} from 'react'

export type IconName = keyof typeof Icons

interface Props extends LucideProps {
    name: IconName
}

const LucideIcon:FC<Props> = ({name, ...props}) => {
    const Icon = Icons[name] as React.ForwardRefExoticComponent<LucideProps & React.RefAttributes<SVGSVGElement>>

    if (!Icon) return null
    return <Icon {...props} />
}

export default LucideIcon
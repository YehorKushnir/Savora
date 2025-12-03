'use server'

import {auth} from "@/auth";
import {prisma} from "@/prisma";

export const updateUserLocale = async ( locale: string) => {
    const session = await auth();
    if (!session?.user?.id) return;

    await prisma.user.update({
        where: { id: session.user.id },
        data: { locale }
    });
}

export const updateUserCurrency = async (currency: string) => {
    const session = await auth();
    if (!session?.user?.id) return;

    await prisma.user.update({
        where: { id: session.user.id },
        data: { currency }
    });
}

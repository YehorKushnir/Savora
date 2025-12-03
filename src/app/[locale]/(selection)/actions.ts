'use server'

import {auth} from "@/auth";
import {prisma} from "@/prisma";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

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

    (await cookies()).set('currency_setup', 'true', {
        maxAge: 3600,
        path: '/'
    });
}

export async function checkUserHasCurrency() {
    const session = await auth();
    if (!session?.user?.id) return false;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { currency: true }
    });

    return !!user?.currency;
}

export async function restoreUserAccess(locale: string) {
    (await cookies()).set('currency_setup', 'true', { maxAge: 3600, path: '/' });
    redirect(`/${locale}/dashboard`);
}

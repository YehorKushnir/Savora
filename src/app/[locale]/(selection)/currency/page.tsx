import { auth } from "@/auth";
import {getCurrencies} from "@/src/app/[locale]/(dashboard)/actions";
import {CurrencyForm} from "@/src/components/currency-form";
import { redirect } from "next/navigation";

export default async function CurrencyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const session = await auth();

    if (!session?.user?.id) return redirect(`/${locale}/login`);

    const currencies = await getCurrencies();

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <CurrencyForm currencies={currencies} />
        </div>
    );
}

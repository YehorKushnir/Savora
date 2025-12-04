import {getCurrencies} from "@/src/app/[locale]/(dashboard)/actions";
import {CurrencyForm} from "@/src/components/currency-form";

export default async function CurrencyPage() {
    const currencies = await getCurrencies();

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <CurrencyForm currencies={currencies} />
        </div>
    );
}

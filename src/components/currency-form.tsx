'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/src/components/ui/command'
import { ChevronsUpDown, Check, Loader2Icon } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { ICurrencies } from '@/src/lib/types/currencies'
import {useLocale, useTranslations} from 'next-intl'
import { useState } from 'react'

import Image from "next/image";
import {updateUserCurrency} from "@/src/app/[locale]/(selection)/actions";

const formSchema = z.object({
    currency: z.string().min(3, { message: "Please select a currency" })
})

type FormValues = z.infer<typeof formSchema>

interface Props {
    currencies: ICurrencies
}

export function CurrencyForm({ currencies }: Props) {
    const t = useTranslations('Selection');
    const [open, setOpen] = useState(false);
    const locale = useLocale();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currency: ''
        }
    })

    const onSubmit = async (values: FormValues) => {
        try {
            await updateUserCurrency(values.currency);
            window.location.assign(`/${locale}/dashboard`);
        } catch (error) {
            console.error("Failed to update currency", error);
        }
    }

    return (
        <div className="w-full max-w-sm">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-md">
                        <Image width={32} height={32} src={'/light.svg'} alt={'logo'} />
                    </div>
                    <h1 className="text-xl font-bold">{t('setup_currency_title') || "Welcome! Let's set up"}</h1>
                    <p className="text-center text-sm text-muted-foreground">
                        {t('setup_currency_desc') || "Please choose your main currency to continue."}
                    </p>
                </div>

                <div className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>{t('select_currency_label') || "Select your main currency"}</FormLabel>
                                        <Popover open={open} onOpenChange={setOpen} modal={true}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? `${field.value} - ${currencies[field.value]}`
                                                            : (t('select_currency_placeholder') || "Select currency")}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search currency..." />
                                                    <CommandList>
                                                        <CommandEmpty>No currency found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {Object.entries(currencies).map(([code, name]) => (
                                                                <CommandItem
                                                                    value={`${code} ${name}`}
                                                                    key={code}
                                                                    onSelect={() => {
                                                                        form.setValue("currency", code)
                                                                        setOpen(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            code === field.value ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <span className="font-bold mr-2">{code}</span>
                                                                    <span className="truncate">{name}</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                                {t('continue') || "Continue"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
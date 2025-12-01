'use client'

import {
    DialogHeader,
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle, DialogFooter
} from '@/src/components/ui/dialog'
import {Button} from '@/src/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/src/components/ui/form'
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from '@/src/components/ui/select'
import {Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem} from '@/src/components/ui/command'
import {Input} from '@/src/components/ui/input'
import {z} from "zod"
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import IconPicker from '@/src/components/icon-picker'
import { IconName } from "../lib/types/icon-picker-types"
import {ChevronsUpDown, icons, Loader2Icon, type LucideIcon, Check, HelpCircle} from 'lucide-react'
import {createWallet, updateWallet} from '@/src/app/[locale]/(dashboard)/wallets/actions'
import {FC, use, useEffect} from 'react'
import {ICurrencies} from '@/src/lib/types/currencies'
import {Popover, PopoverContent, PopoverTrigger} from './ui/popover'
import {cn} from '@/src/lib/utils'
import {useWallets} from '@/src/lib/stores/wallets-store'
import {DialogClose} from '@radix-ui/react-dialog'
import {walletCreateDto} from '@/src/lib/dto/wallet-create-dto'
import {walletUpdateDto} from '@/src/lib/dto/wallet-update-dto'
import {ClientWallet} from "@/src/lib/types/client-wallet-type";
import { useTranslations } from 'next-intl';

const formSchema = z.object({
    name: z.string().min(2).max(20),
    balance: z.string().transform((val) => val === "" ? "0" : val),
    icon: z.string().min(2),
    type: z.enum(['asset', 'liability']),
    currency: z.string().min(3)
})

type WalletFormValues = z.infer<typeof formSchema>

interface Props {
    currencies: Promise<ICurrencies>
}

const WalletModal: FC<Props> = ({currencies}) => {
    const open = useWallets(state => state.openModal)
    const setOpen = useWallets(state => state.setOpenModal)
    const t = useTranslations('Wallets.modal');

    const wallets = useWallets(state => state.wallet) as ClientWallet | undefined

    const allCurrencies = use(currencies)

    const defaultValues: WalletFormValues = wallets ? {
        name: wallets.name,
        type: wallets.type as 'asset' | 'liability',
        icon: wallets.icon,
        currency: wallets.currency,
        balance: String(wallets.balance)
    } : {
        name: '',
        type: 'asset',
        icon: 'CreditCard',
        currency: 'EUR',
        balance: ''
    }

    const form = useForm<WalletFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    useEffect(() => {
        if (open) form.reset(defaultValues)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, wallets, form])

    const iconName = form.watch().icon as IconName
    const Icon = (icons[iconName] || HelpCircle) as LucideIcon

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            wallets
                ? await updateWallet(wallets.id, walletUpdateDto(values))
                : await createWallet(walletCreateDto(values))

            setOpen(false)
            form.reset()
        } catch (error) {
            console.error(error)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={'w-full'}>{t('title_add')}</Button>
            </DialogTrigger>
            <DialogContent className={'max-w-[340px]'} aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{wallets ? t('title_update') : t('title_add')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-8"
                        onSubmit={onSubmit}
                    >
                        <div className={'w-full flex gap-3 mb-3'}>
                            <div className={'min-w-21 h-21 cursor-pointer flex items-center justify-center rounded-md shadow-xs hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring bg-secondary text-secondary-foreground'}>
                                <Icon className={'w-16 h-16'}/>
                            </div>
                            <div className={'w-full flex flex-col gap-3'}>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder={t('name_placeholder')} {...field} name={'name'}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select {...field} onValueChange={value => field.onChange(value)} name={'type'}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={t('type_placeholder')}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="asset">{t('type_asset')}</SelectItem>
                                                        <SelectItem value="liability">{t('type_liability')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({field}) => (
                                <FormItem className={'mb-4'}>
                                    <FormLabel>{t('icon_label')}</FormLabel>
                                    <FormControl>
                                        <div>
                                            <input type="hidden" name="icon" value={field.value}/>
                                            <IconPicker value={field.value as IconName} onIconChange={field.onChange}/>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({field}) => (
                                <FormItem className="mb-4">
                                    <FormLabel>{t('currency_label')}</FormLabel>
                                    <FormControl>
                                        <Popover modal={true}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={'sm:w-[462px] w-[290px] justify-between'}
                                                >
                                                    {field.value
                                                        ? (
                                                            <div className={'w-full flex gap-2'}>
                                                                <div
                                                                    className={'w-8 flex justify-start font-bold'}>{field.value}</div>
                                                                <div>{allCurrencies[field.value]}</div>
                                                            </div>
                                                        )
                                                        : t('select_currency')}
                                                    <ChevronsUpDown className="opacity-50"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="sm:w-[462px] w-[290px] p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder={t('search_currency')}
                                                        className="h-9"
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>{t('no_currency')}</CommandEmpty>
                                                        <CommandGroup>
                                                            {Object.entries(allCurrencies).map(([code, name]) => (
                                                                <CommandItem
                                                                    value={`${code} ${name}`}
                                                                    key={code}
                                                                    onSelect={() => field.onChange(code)}
                                                                >
                                                                    <div className={'w-8 flex justify-start font-bold'}>
                                                                        {code}
                                                                    </div>
                                                                    <div>{name}</div>
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            code === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="balance"
                            render={({field}) => (
                                <FormItem className={'mb-4'}>
                                    <FormLabel>{t('balance_label')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('balance_placeholder')} {...field} type={'number'} name={'balance'}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">{t('cancel')}</Button>
                            </DialogClose>
                            <Button
                                type={'submit'}
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? (
                                        <>
                                            <Loader2Icon className="animate-spin mr-2"/>
                                            {t('submitting')}
                                        </>
                                    ) : t('submit')
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default WalletModal
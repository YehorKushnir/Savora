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
import {walletTypes} from '@/src/lib/wallet-types'
import IconPicker, {IconName} from '@/src/components/icon-picker'
import {ChevronsUpDown, icons, Loader2Icon, type LucideIcon, Check} from 'lucide-react'
import {createWallet, updateWallet} from '@/src/app/(dashboard)/wallets/actions'
import {FC, use, useEffect} from 'react'
import {ICurrencies} from '@/src/lib/types/currencies'
import {Popover, PopoverContent, PopoverTrigger} from './ui/popover'
import {cn} from '@/src/lib/utils'
import {useWallets} from '@/src/lib/stores/wallets-store'
import {DialogClose} from '@radix-ui/react-dialog'

const formSchema = z.object({
    name: z.string().min(2).max(20),
    balance: z.string(),
    icon: z.string().min(2),
    type: z.string().min(2),
    currency: z.string().min(3),
})

interface Props {
    currencies: Promise<ICurrencies>
}

const WalletModal: FC<Props> = ({currencies}) => {
    const open = useWallets(state => state.openModal)
    const setOpen = useWallets(state => state.setOpenModal)
    const wallets = useWallets(state => state.wallet)
    const allCurrencies = use(currencies)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: wallets ?? {
            name: '',
            type: '',
            icon: 'CreditCard',
            currency: 'EUR',
            balance: ''
        }
    })

    useEffect(() => {
        if (open) form.reset(wallets)
    }, [open, wallets, form])

    const Icon = icons[form.watch().icon as IconName] as LucideIcon

    const onSubmit = form.handleSubmit(async (values) => {
        const data = new FormData()

        if (wallets) data.append('id', wallets?.id)
        data.append('name', values.name)
        data.append('icon', values.icon)
        data.append('balance', values.balance)
        data.append('type', values.type)
        data.append('currency', values.currency)

        wallets
            ? await updateWallet(data)
            : await createWallet(data)

        setOpen(false)
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={'w-full'}>Add wallet</Button>
            </DialogTrigger>
            <DialogContent className={'max-w-[340px]'} aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{wallets ? 'Update' : 'Add'} wallet</DialogTitle>
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
                                                <Input placeholder="Name" {...field} name={'name'}/>
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
                                                        <SelectValue placeholder="Type"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {walletTypes.map(type => (
                                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                                        ))}
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
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <div>
                                            <input type="hidden" name="icon" value={field.value}/>
                                            <IconPicker value={field.value as IconName} onChange={field.onChange}/>
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
                                    <FormLabel>Currency</FormLabel>
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
                                                        : "Select currency"}
                                                    <ChevronsUpDown className="opacity-50"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="sm:w-[462px] w-[290px] p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search currency..."
                                                        className="h-9"
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>No currency found.</CommandEmpty>
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
                                    <FormLabel>Initial balance</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Balance" {...field} type={'number'} name={'balance'}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                type={'submit'}
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? (
                                        <>
                                            <Loader2Icon className="animate-spin"/>
                                            Submitting...
                                        </>
                                    ) : 'Submit'
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
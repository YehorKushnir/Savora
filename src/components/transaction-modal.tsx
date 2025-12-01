'use client'

import {
    DialogHeader,
    Dialog,
    DialogContent,
    DialogTitle, DialogFooter, DialogClose
} from '@/src/components/ui/dialog'
import {Button} from '@/src/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel} from '@/src/components/ui/form'
import {Input} from '@/src/components/ui/input'
import {z} from "zod"
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {Loader2Icon} from 'lucide-react'
import {use, useEffect} from 'react'
import {Tabs, TabsList, TabsTrigger} from './ui/tabs'
import {useTransactions} from '@/src/lib/stores/transactions-store'
import {ClientCategory} from '@/src/app/[locale]/(dashboard)/categories/actions'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/src/components/ui/select'
import LucideIcon, {IconName} from '@/src/components/lucide-icon'
import {createTransaction, updateTransaction} from '@/src/app/[locale]/(dashboard)/transactions/actions'
import {ClientWallet} from "@/src/lib/types/client-wallet-type";
import { useTranslations } from 'next-intl';

// Schema remains untranslated for logic stability, usually handled via separate library or map
export const transactionSchema = z.object({
    id: z.string().optional(),
    type: z.enum(["income", "expense", "transfer"]),
    description: z.string().max(50).optional(),
    amount: z.string().min(1),
    toReceive: z.string().optional(),

    tagName: z.string().optional(),
    categoryId: z.string().optional(),

    sourceWalletId: z.string().optional(),
    targetWalletId: z.string().optional(),
})
    .superRefine((transaction, context) => {
        if (transaction.type === "transfer") {
            if (!transaction.sourceWalletId) {
                context.addIssue({
                    code: "custom",
                    path: ["sourceWalletId"],
                    message: "Required for transfer",
                })
            }
            if (!transaction.targetWalletId) {
                context.addIssue({
                    code: "custom",
                    path: ["targetWalletId"],
                    message: "Required for transfer",
                })
            }
            if (
                transaction.sourceWalletId &&
                transaction.targetWalletId &&
                transaction.sourceWalletId === transaction.targetWalletId
            ) {
                context.addIssue({
                    code: "custom",
                    path: ["targetWalletId"],
                    message: "Can't transfer to the same wallet",
                })
            }
            if (!transaction.toReceive) {
                context.addIssue({
                    code: "custom",
                    path: ["toReceive"],
                    message: "Amount to get is required",
                })
            }
        } else {
            if (!transaction.sourceWalletId) {
                context.addIssue({
                    code: "custom",
                    path: ["sourceWalletId"],
                    message: "Wallet is required",
                })
            }
            if (!transaction.categoryId) {
                context.addIssue({
                    code: "custom",
                    path: ["categoryId"],
                    message: "Category is required",
                })
            }
        }
    })

export type TTransaction = z.infer<typeof transactionSchema>

interface Props {
    categories: Promise<ClientCategory[]>
    wallets: Promise<ClientWallet[]>
}

export default function TransactionModal(props: Props) {
    const categories = use(props.categories)
    const wallets = use(props.wallets)
    const open = useTransactions(state => state.openModal)
    const setOpen = useTransactions(state => state.setOpenModal)
    const transaction = useTransactions(state => state.transaction)
    const t = useTranslations('Transactions.modal');

    const defaultValues: Partial<TTransaction> = transaction ? {
        id: transaction.id,
        type: transaction.type as "income" | "expense" | "transfer",
        description: transaction.description || '',

        tagName: transaction.tags && transaction.tags.length > 0
            ? transaction.tags[0].name
            : '',

        amount: transaction.entries && transaction.entries.length > 0
            ? Math.abs(Number(transaction.entries[0].amount)).toString()
            : '',

        categoryId: transaction.categoryId || '',

        sourceWalletId: transaction.entries?.find(e => Number(e.amount) < 0)?.vaultId || '',

        targetWalletId: transaction.type === 'transfer'
            ? transaction.entries?.find(e => Number(e.amount) > 0)?.vaultId
            : '',

    } : {
        type: 'expense',
        amount: '',
        toReceive: '',
        tagName: '',
        description: '',
        categoryId: '',
        sourceWalletId: '',
        targetWalletId: '',
    }

    const form = useForm<TTransaction>({
        resolver: zodResolver(transactionSchema),
        shouldUnregister: true,
        defaultValues: defaultValues as TTransaction
    })

    const currentType = form.watch('type')
    const filteredCategories = categories.filter(cat => cat.type === currentType)

    useEffect(() => {
        if (open) form.reset(defaultValues)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, transaction, form])

    const onSubmit = form.handleSubmit(async (values) => {
        const payload = {
            type: values.type,
            amount: values.amount,
            description: values.description,
            executedAt: new Date(),

            sourceVaultId: values.sourceWalletId!,

            targetVaultId: values.type === 'transfer' ? values.targetWalletId : undefined,
            categoryId: values.type !== 'transfer' ? values.categoryId : undefined,

            tagName: values.tagName,
        }

        try {
            transaction?.id
                ? await updateTransaction(transaction.id, payload as any)
                : await createTransaction(payload as any)

            setOpen(false)
            form.reset()
        } catch (e) {
            console.error(e)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={'max-w-[340px]'} aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{transaction ? t('title_update') : t('title_add')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-8"
                        onSubmit={onSubmit}
                    >
                        <FormField
                            control={form.control}
                            name="type"
                            render={({field}) => (
                                <FormItem className={'mb-4'}>
                                    <FormControl>
                                        <Tabs {...field} onValueChange={(value) => field.onChange(value)}>
                                            <TabsList className={'w-full'}>
                                                <TabsTrigger value="income">{t('tabs.income')}</TabsTrigger>
                                                <TabsTrigger value="expense">{t('tabs.expense')}</TabsTrigger>
                                                <TabsTrigger value="transfer">{t('tabs.transfer')}</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {form.watch().type === 'transfer' ? (
                            <>
                                <FormField
                                    control={form.control}
                                    name="sourceWalletId"
                                    render={({field}) => (
                                        <FormItem className={'w-full flex items-center gap-2 mb-4'}>
                                            <FormLabel className={'min-w-20'}>{t('labels.from')}</FormLabel>
                                            <FormControl>
                                                <Select {...field} onValueChange={value => field.onChange(value)}>
                                                    <SelectTrigger className={'w-full'}>
                                                        <SelectValue placeholder={t('placeholders.wallet')}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {wallets.map(item => (
                                                            <SelectItem
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                <LucideIcon name={item.icon as IconName}/>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="targetWalletId"
                                    render={({field}) => (
                                        <FormItem className={'w-full flex items-center gap-2 mb-4'}>
                                            <FormLabel className={'min-w-20'}>{t('labels.to')}</FormLabel>
                                            <FormControl>
                                                <Select {...field} onValueChange={value => field.onChange(value)}>
                                                    <SelectTrigger className={'w-full'}>
                                                        <SelectValue placeholder={t('placeholders.wallet')}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {wallets.map(item => (
                                                            <SelectItem
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                <LucideIcon name={item.icon as IconName}/>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </>
                        ) : (
                            <>
                                <FormField
                                    control={form.control}
                                    name="sourceWalletId"
                                    render={({field}) => (
                                        <FormItem className={'w-full flex items-center gap-2 mb-4'}>
                                            <FormLabel className={'min-w-20'}>{t('labels.wallet')}</FormLabel>
                                            <FormControl>
                                                <Select {...field} onValueChange={value => field.onChange(value)}>
                                                    <SelectTrigger className={'w-full'}>
                                                        <SelectValue placeholder={t('placeholders.wallet')}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {wallets.map(item => (
                                                            <SelectItem
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                <LucideIcon name={item.icon as IconName}/>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({field}) => (
                                        <FormItem className={'w-full flex items-center gap-2 mb-4'}>
                                            <FormLabel className={'min-w-20'}>{t('labels.category')}</FormLabel>
                                            <FormControl>
                                                <Select
                                                    {...field}
                                                    onValueChange={value => field.onChange(value)}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className={'w-full'}>
                                                        <SelectValue placeholder={t('placeholders.category')}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {filteredCategories.length > 0 ? (
                                                            filteredCategories.map(item => (
                                                                <SelectItem key={item.id} value={item.id}>
                                                                    <div className="flex items-center gap-2">
                                                                        {item.icon && <LucideIcon name={item.icon as IconName} className="w-4 h-4"/>}
                                                                        {item.name}
                                                                    </div>
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <div className="p-2 text-sm text-muted-foreground text-center">
                                                                {t('no_categories', { type: currentType })}
                                                            </div>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({field}) => (
                                <FormItem className={'w-full flex items-center gap-2 mb-4'}>
                                    <FormLabel className={'min-w-20'}>{t('labels.amount')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={t('placeholders.amount')}
                                            type={'number'}
                                            name={'amount'}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {form.watch().type === 'transfer' && (
                            <FormField
                                control={form.control}
                                name="toReceive"
                                render={({field}) => (
                                    <FormItem className={'w-full flex items-center gap-2 mb-4'}>
                                        <FormLabel className={'min-w-20'}>{t('labels.to_receive')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder={t('placeholders.to_receive')}
                                                type={'number'}
                                                name={'toReceive'}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem className={'flex items-center gap-2 mb-4'}>
                                    <FormLabel className={'min-w-20'}>{t('labels.description')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('placeholders.description')} {...field} name={'description'}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tagName"
                            render={({field}) => (
                                <FormItem className={'flex items-center gap-2 mb-4'}>
                                    <FormLabel className={'min-w-20'}>{t('labels.tag')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('placeholders.tag')} {...field} name={'description'}/>
                                    </FormControl>
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
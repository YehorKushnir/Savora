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
import {ClientCategory} from '@/src/app/(dashboard)/categories/actions'
import {Vault} from '@prisma/client'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/src/components/ui/select'
import LucideIcon, {IconName} from '@/src/components/lucide-icon'
import {createTransaction, updateTransaction} from '@/src/app/(dashboard)/transactions/actions'
import {ClientWallet} from "@/src/lib/types/client-wallet-type";


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
                    <DialogTitle>{transaction ? 'Update' : 'Add'} Transaction</DialogTitle>
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
                                                <TabsTrigger value="income">Income</TabsTrigger>
                                                <TabsTrigger value="expense">Expense</TabsTrigger>
                                                <TabsTrigger value="transfer">Transfer</TabsTrigger>
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
                                            <FormLabel className={'min-w-20'}>From</FormLabel>
                                            <FormControl>
                                                <Select {...field} onValueChange={value => field.onChange(value)}>
                                                    <SelectTrigger className={'w-full'}>
                                                        <SelectValue placeholder={'Wallet'}/>
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
                                            <FormLabel className={'min-w-20'}>To</FormLabel>
                                            <FormControl>
                                                <Select {...field} onValueChange={value => field.onChange(value)}>
                                                    <SelectTrigger className={'w-full'}>
                                                        <SelectValue placeholder={'Wallet'}/>
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
                                            <FormLabel className={'min-w-20'}>Wallet</FormLabel>
                                            <FormControl>
                                                <Select {...field} onValueChange={value => field.onChange(value)}>
                                                    <SelectTrigger className={'w-full'}>
                                                        <SelectValue placeholder={'Wallet'}/>
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
                                            <FormLabel className={'min-w-20'}>Category</FormLabel>
                                            <FormControl>
                                                <Select
                                                    {...field}
                                                    onValueChange={value => field.onChange(value)}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className={'w-full'}>
                                                        <SelectValue placeholder={'Category'}/>
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
                                                                No categories found for {currentType}
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
                                    <FormLabel className={'min-w-20'}>Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Amount"
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
                                        <FormLabel className={'min-w-20'}>To receive</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="To receive"
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
                                    <FormLabel className={'min-w-20'}>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description" {...field} name={'description'}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tagName"
                            render={({field}) => (
                                <FormItem className={'flex items-center gap-2 mb-4'}>
                                    <FormLabel className={'min-w-20'}>Tag</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tag" {...field} name={'description'}/>
                                    </FormControl>
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
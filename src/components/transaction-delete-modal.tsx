'use client'

import {
    DialogHeader,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter
} from '@/src/components/ui/dialog'
import {Button} from '@/src/components/ui/button'
import {DialogClose} from '@radix-ui/react-dialog'
import {Form} from '@/src/components/ui/form'
import {useForm} from 'react-hook-form'
import {Loader2Icon} from 'lucide-react'
import {useTransactions} from '@/src/lib/stores/transactions-store'
import {deleteTransaction} from '@/src/app/[locale]/(dashboard)/transactions/actions'
import { useTranslations } from 'next-intl';

const TransactionDeleteModal = () => {
    const open = useTransactions(state => state.openDeleteModal)
    const setOpen = useTransactions(state => state.setOpenDeleteModal)
    const transaction = useTransactions(state => state.transaction)
    const t = useTranslations('Transactions.delete_modal');

    const form = useForm()

    const onSubmit = form.handleSubmit(async () => {
        if (transaction?.id) {
            try {
                await deleteTransaction(transaction.id)
                setOpen(false)
            } catch (error) {
                console.error("Failed to delete transaction:", error)
            }
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={'max-w-[340px]'} aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {transaction?.description
                        ? t('confirm_named', { description: transaction.description })
                        : t('confirm_generic')
                    }
                </div>

                <DialogFooter>
                    <Form {...form}>
                        <form onSubmit={onSubmit} className={'flex gap-2 w-full justify-end'}>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">{t('cancel')}</Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                variant={'destructive'}
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? (
                                        <>
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>
                                            {t('deleting')}
                                        </>
                                    ) : t('delete')
                                }
                            </Button>
                        </form>
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TransactionDeleteModal
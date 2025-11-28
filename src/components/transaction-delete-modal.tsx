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
import {deleteTransaction} from '@/src/app/(dashboard)/transactions/actions'

const TransactionDeleteModal = () => {
    const open = useTransactions(state => state.openDeleteModal)
    const setOpen = useTransactions(state => state.setOpenDeleteModal)
    const transaction = useTransactions(state => state.transaction)

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
                    <DialogTitle>Delete transaction</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    Are you sure you want to delete
                    {transaction?.description
                        ? <span className="font-semibold"> "{transaction.description}"</span>
                        : " this transaction"}?
                </div>

                <DialogFooter>
                    <Form {...form}>
                        <form onSubmit={onSubmit} className={'flex gap-2 w-full justify-end'}>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">Cancel</Button>
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
                                            Deleting...
                                        </>
                                    ) : 'Delete'
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
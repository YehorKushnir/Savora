'use client'

import {
    DialogHeader,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter
} from '@/src/components/ui/dialog'
import {Button} from '@/src/components/ui/button'
import {deleteWallet} from '@/src/app/(dashboard)/wallets/actions'
import {useWallets} from '@/src/lib/stores/wallets-store'
import {DialogClose} from '@radix-ui/react-dialog'
import { Form } from './ui/form'
import {useForm} from 'react-hook-form'
import {Loader2Icon} from 'lucide-react'

const WalletDeleteModal = () => {
    const open = useWallets(state => state.openDeleteModal)
    const setOpen = useWallets(state => state.setOpenDeleteModal)
    const wallet = useWallets(state => state.wallet)

    const form = useForm()

    const onSubmit = form.handleSubmit(async () => {
        if (wallet?.id) {
            await deleteWallet(wallet?.id)
            setOpen(false, wallet)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={'max-w-[340px]'} aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Delete wallet</DialogTitle>
                </DialogHeader>
                <div>Are you sure to delete wallet "{wallet?.name}"?</div>
                <DialogFooter>
                    <Form {...form}>
                        <form onSubmit={onSubmit} className={'flex gap-2'}>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" variant={'destructive'} disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting
                                    ? (
                                        <>
                                            <Loader2Icon className="animate-spin"/>
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

export default WalletDeleteModal
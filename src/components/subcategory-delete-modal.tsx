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
import { Form } from './ui/form'
import {useForm} from 'react-hook-form'
import {Loader2Icon} from 'lucide-react'
import {useCategories} from '@/src/lib/stores/categories-store'
import {deleteSubcategory} from '@/src/app/(dashboard)/categories/actions'

const SubcategoryDeleteModal = () => {
    const open = useCategories(state => state.openSubcategoryDeleteModal)
    const setOpen = useCategories(state => state.setOpenSubcategoryDeleteModal)
    const subcategory = useCategories(state => state.subcategory)

    const form = useForm()

    const onSubmit = form.handleSubmit(async () => {
        if (subcategory?.id) {
            await deleteSubcategory(subcategory?.id)
            setOpen(false, subcategory)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={'max-w-[340px]'} aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Delete wallet</DialogTitle>
                </DialogHeader>
                <div>Are you sure to delete category "{subcategory?.name}"?</div>
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

export default SubcategoryDeleteModal
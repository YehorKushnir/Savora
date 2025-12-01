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
import {deleteCategory} from "@/src/app/[locale]/(dashboard)/categories/actions";
import { useTranslations } from 'next-intl';

const CategoryDeleteModal = () => {
    const open = useCategories(state => state.openDeleteModal)
    const setOpen = useCategories(state => state.setOpenDeleteModal)
    const category = useCategories(state => state.category)
    const t = useTranslations('Categories');

    const form = useForm()

    const onSubmit = form.handleSubmit(async () => {
        if (category?.id) {
            await deleteCategory(category?.id)
            setOpen(false, category)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={'max-w-[340px]'} aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{t('delete_modal.title')}</DialogTitle>
                </DialogHeader>
                <div>
                    {t('delete_modal.confirm', { name: category?.name ? category.name : 'unknown category' })}
                </div>
                <DialogFooter>
                    <Form {...form}>
                        <form onSubmit={onSubmit} className={'flex gap-2'}>
                            <DialogClose asChild>
                                <Button variant="outline">{t('delete_modal.cancel')}</Button>
                            </DialogClose>
                            <Button type="submit" variant={'destructive'} disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting
                                    ? (
                                        <>
                                            <Loader2Icon className="animate-spin mr-2"/>
                                            {t('delete_modal.deleting')}
                                        </>
                                    ) : t('delete_modal.delete')
                                }
                            </Button>
                        </form>
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CategoryDeleteModal
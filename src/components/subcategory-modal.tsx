'use client'

import {
    DialogHeader,
    Dialog,
    DialogContent,
    DialogTitle, DialogFooter
} from '@/src/components/ui/dialog'
import {Button} from '@/src/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/src/components/ui/form'
import {Input} from '@/src/components/ui/input'
import {z} from "zod"
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {Loader2Icon} from 'lucide-react'
import {useEffect} from 'react'
import {DialogClose} from '@radix-ui/react-dialog'
import {useCategories} from '@/src/lib/stores/categories-store'
import {createSubcategory, updateSubcategory} from '@/src/app/(dashboard)/categories/actions'

export const subcategorySchema = z.object({
    name: z.string().min(2).max(20)
})

const SubcategoryModal = () => {
    const open = useCategories(state => state.openSubcategoryModal)
    const setOpen = useCategories(state => state.setOpenSubcategoryModal)
    const subcategory = useCategories(state => state.subcategory)
    const categoryId = useCategories(state => state.categoryId)

    const form = useForm<z.infer<typeof subcategorySchema>>({
        resolver: zodResolver(subcategorySchema),
        defaultValues: subcategory ?? {
            name: ''
        }
    })

    useEffect(() => {
        if (open) form.reset(subcategory)
    }, [open, subcategory, form])

    const onSubmit = form.handleSubmit(async (values) => {
        subcategory
            ? await updateSubcategory(subcategory.id, values)
            : await createSubcategory(categoryId, values)

        setOpen(false)
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={'max-w-[340px]'} aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{subcategory ? 'Update' : 'Add'} subcategory</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-8"
                        onSubmit={onSubmit}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} name={'name'}/>
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

export default SubcategoryModal
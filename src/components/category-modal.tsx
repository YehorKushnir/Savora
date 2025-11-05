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
import IconPicker, {IconName} from '@/src/components/icon-picker'
import {icons, Loader2Icon, type LucideIcon} from 'lucide-react'
import {useEffect} from 'react'
import {DialogClose} from '@radix-ui/react-dialog'
import {useCategories} from '@/src/lib/stores/categories-store'
import {createCategory, updateCategory} from '@/src/app/(dashboard)/categories/actions'
import {Tabs, TabsList, TabsTrigger} from './ui/tabs'
import {categoryDto} from '@/src/lib/dto/category-dto'

export const categorySchema = z.object({
    name: z.string().min(2).max(20),
    icon: z.string().min(2),
    type: z.enum(['expense', 'income']),
})

const CategoryModal = () => {
    const open = useCategories(state => state.openModal)
    const setOpen = useCategories(state => state.setOpenModal)
    const category = useCategories(state => state.category)

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: category ?? {
            name: '',
            type: 'expense',
            icon: 'CreditCard'
        }
    })

    useEffect(() => {
        if (open) form.reset(category)
    }, [open, category, form])

    const Icon = icons[form.watch().icon as IconName] as LucideIcon

    const onSubmit = form.handleSubmit(async (values) => {
        category
            ? await updateCategory(category.id, categoryDto(values))
            : await createCategory(categoryDto(values))

        setOpen(false)
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/*<DialogTrigger asChild>*/}
            {/*    <Button className={'w-full'}>Add category</Button>*/}
            {/*</DialogTrigger>*/}
            <DialogContent className={'max-w-[340px]'} aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{category ? 'Update' : 'Add'} category</DialogTitle>
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
                                                <Tabs {...field} onValueChange={(value) => field.onChange(value)}>
                                                    <TabsList className={'w-full'}>
                                                        <TabsTrigger value="income">Income</TabsTrigger>
                                                        <TabsTrigger value="expense">Expense</TabsTrigger>
                                                    </TabsList>
                                                </Tabs>
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

export default CategoryModal
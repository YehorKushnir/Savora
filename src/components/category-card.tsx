"use client"

import {ReactNode, use, useEffect, useState} from "react";
import { useCategories } from "@/src/lib/stores/categories-store";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import LucideIcon, { IconName } from "@/src/components/lucide-icon";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger, ContextMenuItem } from '@/src/components/ui/context-menu'
import { ClientCategory } from "@/src/app/(dashboard)/categories/actions";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
    categories: Promise<ClientCategory[]>
}

const SortableItem = ({ item, children }: { item: ClientCategory, children: ReactNode }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1, // Делаем полупрозрачным при перетаскивании
        position: 'relative' as const,
        zIndex: isDragging ? 999 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
};

export const CategoryCard = (props: Props) => {
    const data = use(props.categories)
    const [card, setCard] = useState([...data])
    const type = useCategories((state) => state.type)
    const setOpenModal = useCategories((state) => state.setOpenModal)
    const setOpenDeleteModal = useCategories((state) => state.setOpenDeleteModal)
    const searchValue = useCategories((state) => state.searchValue)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const typeConversion = (categories: ClientCategory) => {
        return {
            id: categories.id,
            name: categories.name,
            icon: categories.icon,
            type: categories.type as 'income' | 'expense'
        }
    }

    useEffect(() => {
        let filteredData = type === 'all' ? data : data.filter((item) => item.type === type);

        if (searchValue) {
            const lowerSearch = searchValue.toLowerCase();
            filteredData = filteredData.filter((item) =>
                item.name.toLowerCase().includes(lowerSearch)
            );
        }

        setCard(filteredData);
    }, [data, type, searchValue])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setCard((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });

            // TODO: Здесь можно вызвать Server Action для сохранения нового порядка в БД
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={card.map(c => c.id)}
                strategy={rectSortingStrategy}
            >
                <div className="grid grid-cols-4 gap-4">
                    {card.map((item) => (
                        <SortableItem key={item.id} item={item}>
                            <ContextMenu>
                                <ContextMenuTrigger className={'w-full'}>
                                    <Card
                                        className={`w-full flex flex-row gap-4 items-center py-2 px-4 rounded-md cursor-pointer select-none hover:bg-accent/50 transition-colors`}
                                    >
                                        <LucideIcon name={item.icon as IconName} size={40} />
                                        <CardHeader className={'w-full p-0'}>
                                            <CardTitle className={'flex'}>{item.name}</CardTitle>
                                        </CardHeader>
                                    </Card>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuItem onClick={() => setOpenModal(true, typeConversion(item))}>
                                        Edit category
                                    </ContextMenuItem>
                                    <ContextMenuItem
                                        onClick={() => setOpenDeleteModal(true, typeConversion(item))}
                                    >
                                        Delete
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        </SortableItem>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}
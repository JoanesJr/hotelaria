import { Prisma, Item } from '@prisma/client';

export interface ItemsRepository {
    findById(id: string): Promise<Item | null>
    findByName(name: string): Promise<Item | null>
    findAll(): Promise<Item[] | null>
    create(data: Prisma.ItemCreateInput): Promise<Item>
    delete(id: string): Promise<Item>;
    update(id: string, data: Prisma.ItemUpdateInput): Promise<Item>
}
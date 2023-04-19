import { ItemsRepository } from '@/repositories/items-repository';
import { Item, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';

export class InMemoryItemsRepository implements ItemsRepository {
    public items: Item[] = [];

    async findAll(): Promise<Item[]> {
        return this.items;
    }

    async findById(id: string) {
        const item = this.items.find((item) => item.id === id);

        if (!item) {
            return null;
        }

        return item;
    }

    async findByName(name: string) {
        const item = this.items.find((item) => item.name === name);

        if (!item) {
            return null;
        }

        return item;
    }

    async create(data: Prisma.ItemCreateInput) {
        const item = {
            id: randomUUID(),
            name: data.name,
            info: data.info,
            price: data.price,
            url: data.url || '',
            created_at: new Date(),
        };

        this.items.push(item);

        return item;
    }

    async delete(id: string) {
        const items = this.items.filter((item) => item.id != id);
        const item = this.items.filter((item) => item.id == id)[0];

        this.items = items;

        return item;
    }

    async update(id: string, data: Prisma.ItemUpdateInput) {

        const itemOld = this.items.filter(item => item.id == id)[0];
        const indexItem = this.items.indexOf(itemOld);

        const mergeObject = Object.assign(itemOld, data);

        this.items[indexItem] = mergeObject;

        return mergeObject;

    }
}
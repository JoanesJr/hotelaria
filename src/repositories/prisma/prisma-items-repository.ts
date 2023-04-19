import { prisma } from '@/lib/prisma';
import { Prisma, Item } from '@prisma/client';
import { ItemsRepository } from '../item-repository';

export class PrismaItemsRepository implements ItemsRepository {

    async findAll(): Promise<Item[] | null> {
        const item = await prisma.item.findMany();

        return item;
    }

    async findById(id: string): Promise<Item | null> {
        const item = await prisma.item.findUnique({
            where: {
                id
            }
        });

        return item;
    }

    async findByName(name: string): Promise<Item | null> {
        const item = await prisma.item.findUnique({
            where: {
                name
            }
        });

        return item;
    }

    async create(data: Prisma.ItemCreateInput): Promise<Item> {
        const item = await prisma.item.create({
            data
        });

        return item;
    }

    async delete(id: string): Promise<Item> {
        const item = await prisma.item.delete({
            where: {
                id
            }
        });

        return item;
    }

    async update(id: string, data: Prisma.ItemUpdateInput): Promise<Item> {
        const item = await prisma.item.update({
            data,
            where: {
                id
            }
        });

        return item;
    }
}
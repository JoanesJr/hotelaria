import { prisma } from '@/lib/prisma';
import { Prisma, AccountItem } from '@prisma/client';
import { AccountItemRepository } from '../account-item-repository';

export class PrismaAccountItemRepository implements AccountItemRepository {
    async findByAccount(accountId: string): Promise<AccountItem[] | null> {
        const items = await prisma.accountItem.findMany({
            where: {
                accountId
            }
        });

        return items;
    }

    async findAll(): Promise<AccountItem[] | null> {
        const account = await prisma.accountItem.findMany();

        return account;
    }

    async findById(id: string): Promise<AccountItem | null> {
        const account = await prisma.accountItem.findUnique({
            where: {
                id
            }
        });

        return account;
    }


    async create(data: Prisma.AccountItemCreateInput): Promise<AccountItem> {
        const account = await prisma.accountItem.create({
            data
        });

        return account;
    }

    async delete(id: string): Promise<AccountItem> {
        const account = await prisma.accountItem.delete({
            where: {
                id
            }
        });

        return account;
    }

    async update(id: string, data: Prisma.AccountUpdateInput): Promise<AccountItem> {
        const account = await prisma.accountItem.update({
            data,
            where: {
                id
            }
        });

        return account;
    }

    async deleteAll() {
        await prisma.accountItem.deleteMany();
    }
}
import { prisma } from '@/lib/prisma';
import { Prisma, Account } from '@prisma/client';
import { AccountRepository } from '../account-repository';

export class PrismaAccountRepository implements AccountRepository {

    async findAll(): Promise<Account[] | null> {
        const account = await prisma.account.findMany();

        return account;
    }

    async findById(id: string): Promise<Account | null> {
        const account = await prisma.account.findUnique({
            where: {
                id
            }
        });

        return account;
    }

    async findByCheckIn(checkInId: string): Promise<Account | null> {
        const account = await prisma.account.findUnique({
            where: {
                checkInId
            }
        });

        return account;
    }

    async create(data: Prisma.AccountCreateInput): Promise<Account> {
        const account = await prisma.account.create({
            data
        });

        return account;
    }

    async delete(id: string): Promise<Account> {
        const account = await prisma.account.delete({
            where: {
                id
            }
        });

        return account;
    }

    async update(id: string, data: Prisma.AccountUpdateInput): Promise<Account> {
        const account = await prisma.account.update({
            data,
            where: {
                id
            }
        });

        return account;
    }
}
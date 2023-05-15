import { prisma } from '@/lib/prisma';
import { Prisma, Account } from '@prisma/client';
import { AccountRepository } from '../account-repository';
import { StatusAccount } from '@/use-cases/userCases/account';

export class PrismaAccountRepository implements AccountRepository {

    async findAll(): Promise<Account[] | null> {
        const account = await prisma.account.findMany();

        return account;
    }

    async findById(id: string): Promise<Account | null> {
        const account = await prisma.account.findUnique({
            where: {
                id
            },
            include: {
                items: true
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

    async create(data: Prisma.AccountCreateInput, dataItems): Promise<Account> {
        const account = await prisma.account.create({
            data: {
                ...data,
                items: {
                    create: dataItems
                }
            },
            include: {
                items: true
            }
        });

        return account;
    }

    async cancel(id: string): Promise<Account> {
        const account = await prisma.account.update({
            data: {
                status: StatusAccount.cancelado
            },
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

    async deleteAll() {
        await prisma.account.deleteMany();
    }
}
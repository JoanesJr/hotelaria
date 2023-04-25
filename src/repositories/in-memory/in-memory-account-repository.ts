import { AccountRepository } from '@/repositories/account-repository';
import { Account, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';

export class InMemoryAccountRepository implements AccountRepository {
    public accounts: Account[] = [];

    async findAll(): Promise<Account[]> {
        return this.accounts;
    }

    async findById(id: string) {
        const account = this.accounts.find((account) => account.id === id);

        if (!account) {
            return null;
        }

        return account;
    }

    async findByCheckIn(checkInId: string) {
        const account = this.accounts.find((account) => account.checkInId === checkInId);

        if (!account) {
            return null;
        }

        return account;
    }

    async create(data: Prisma.AccountCreateInput) {
        const account = {
            id: randomUUID(),
            checkInId: data.id_checkin,
            items: data.items,
            roomValue: data.roomValue,
            total: data.total,
            status: data.status,
            created_at: new Date(),
        };

        this.accounts.push(account);

        return account;
    }

    async delete(id: string) {
        const accounts = this.accounts.filter((account) => account.id != id);
        const account = this.accounts.filter((account) => account.id == id)[0];

        this.accounts = accounts;

        return account;
    }

    async update(id: string, data: Prisma.AccountUpdateInput) {

        const accountOld = this.accounts.filter(account => account.id == id)[0];
        const indexAccount = this.accounts.indexOf(accountOld);

        const mergeObject = Object.assign(accountOld, data);

        this.accounts[indexAccount] = mergeObject;

        return mergeObject;

    }
}
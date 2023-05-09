import { Prisma, AccountItem } from '@prisma/client';

export interface AccountItemRepository {
    findById(id: string): Promise<AccountItem | null>
    findAll(): Promise<AccountItem[] | null>
    findByAccount(accountId: string): Promise<AccountItem[] | null>
    create(data: Prisma.AccountItemCreateInput): Promise<AccountItem>
    update(id: string, data: Prisma.AccountItemUpdateInput): Promise<AccountItem>
    delete(id: string): Promise<AccountItem>;
}
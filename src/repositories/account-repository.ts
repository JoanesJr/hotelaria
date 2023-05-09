import { Prisma, Account } from '@prisma/client';

export interface AccountRepository {
    findById(id: string): Promise<Account | null>
    findAll(): Promise<Account[] | null>
    findByCheckIn(reservationId: string): Promise<Account | null>
    create(data: Prisma.AccountCreateInput, dataItem: any): Promise<Account>
    update(id: string, data: Prisma.AccountUpdateInput): Promise<Account>
    cancel(id: string): Promise<Account>;
}
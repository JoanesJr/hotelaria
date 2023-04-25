import { Prisma, Account } from '@prisma/client';

export interface AccountRepository {
    findById(id: string): Promise<Account | null>
    findAll(): Promise<Account[] | null>
    findByCheckIn(reservationId: string): Promise<Account | null>
    create(data: Prisma.AccountCreateInput): Promise<Account>
    update(id: string, data: Prisma.AccountUpdateInput): Promise<Account>
    delete(id: string): Promise<Account>;
}
import { Prisma,  Address } from '@prisma/client';

export interface AddressRepository {
    findById(id: string): Promise< Address | null>
    findByUser(userId: string): Promise<Address | null>
    findAll(): Promise< Address[] | null>
    create(data: Prisma.AddressCreateInput): Promise< Address>
    delete(id: string): Promise< Address>;
    update(id: string, data: Prisma.AddressUpdateInput): Promise<Address>
}
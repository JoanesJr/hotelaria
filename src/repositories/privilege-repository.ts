import { Prisma,  Privilege } from '@prisma/client';

export interface PrivilegeRepository {
    findById(id: string): Promise< Privilege | null>
    findByUser(userId: string): Promise< Privilege[] | null>
    findAll(): Promise< Privilege[] | null>
    create(data: Prisma.PrivilegeCreateInput): Promise< Privilege>
    delete(id: string): Promise< Privilege>;
    update(id: string, data: Prisma.PrivilegeUpdateInput): Promise<Privilege>
}
import { prismaTst as prisma } from '@/lib/prisma-tst';
import { Privilege, Prisma, } from '@prisma/client';
import { PrivilegeRepository } from '../privilege-repository';

export class PrismaPrivilegeRepository implements PrivilegeRepository {
    async findByUser(userId: string): Promise<Privilege[] | null> {
        const privilege = await prisma.privilege.findMany({
            where: {
                User: {
                    some: {
                        id: userId
                    }
                }
            }
        });

        return privilege;
    }

    async findAll(): Promise<Privilege[] | null> {
        const privilege = await prisma.privilege.findMany();

        return privilege;
    }

    async findById(id: string): Promise<Privilege | null> {
        const privilege = await prisma.privilege.findUnique({
            where: {
                id
            }
        });

        return privilege;
    }


    async create(data: Prisma.PrivilegeCreateInput) {
        const privilege = await prisma.privilege.create({
            data,
            include: {
                User: true
            }
        });

        return privilege;
    }

    async delete(id: string): Promise<Privilege> {
        const privilege = await prisma.privilege.delete({
            where: {
                id
            }
        });

        return privilege;
    }

    async update(id: string, data: Prisma.PrivilegeUpdateInput): Promise<Privilege> {
        const privilege = await prisma.privilege.update({
            data,
            where: {
                id
            }
        });

        return privilege;
    }
}
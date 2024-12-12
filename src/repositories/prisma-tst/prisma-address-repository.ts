import { prismaTst as prisma } from '@/lib/prisma-tst';
import { Address, Prisma, } from '@prisma/client';
import { AddressRepository } from '../address-repository';

export class PrismaAddresssRepository implements AddressRepository {
    async findByUser(userId: string): Promise<Address | null> {
        const address = await prisma.address.findMany({
            where: {
                User: {
                    some: {
                        id: userId
                    }
                }
            }
        });

        return address[0];
    }

    async findAll(): Promise<Address[] | null> {
        const address = await prisma.address.findMany();

        return address;
    }

    async findById(id: string): Promise<Address | null> {
        const address = await prisma.address.findUnique({
            where: {
                id
            }
        });

        return address;
    }


    async create(data: Prisma.AddressCreateInput) {
        const address = await prisma.address.create({
            data,
            include: {
                User: true
            }
        });

        return address;
    }

    async delete(id: string): Promise<Address> {
        const address = await prisma.address.delete({
            where: {
                id
            }
        });

        return address;
    }

    async update(id: string, data: Prisma.AddressUpdateInput): Promise<Address> {
        const address = await prisma.address.update({
            data,
            where: {
                id
            }
        });

        return address;
    }
}
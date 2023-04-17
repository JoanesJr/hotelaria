import { prisma } from '@/lib/prisma';
import { Address, Prisma, } from '@prisma/client';
import { AddressRepository } from '../address-repository';

export class PrismaAddresssRepository implements AddressRepository {

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

    async findByUser(id_user: string): Promise<Address> {
        const address = await prisma.address.findFirst({
            where: {
                userId: id_user
            }
        });

        return address;
    }

    async create(data: Prisma.AddressCreateInput) {
        const address = await prisma.address.create({
            data,
            include: {
                id_user: true
            }
        });

        return address;
    }
}
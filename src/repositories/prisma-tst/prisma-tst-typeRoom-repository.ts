import { prismaTst as prisma } from '@/lib/prisma-tst';
import { TypeRoom, Prisma, } from '@prisma/client';
import { TypeRoomRepository } from '../typeRoom-repository';

export class PrismaTstTypeRoomRepository implements TypeRoomRepository {

    async findAll(): Promise<TypeRoom[] | null> {
        const typeRoom = await prisma.typeRoom.findMany();

        return typeRoom;
    }

    async findById(id: string): Promise<TypeRoom | null> {
        const typeRoom = await prisma.typeRoom.findUnique({
            where: {
                id
            }
        });

        return typeRoom;
    }

    async findByName(name: string): Promise<TypeRoom | null> {
        const typeRoom = await prisma.typeRoom.findUnique({
            where: {
                name
            }
        });

        return typeRoom;
    }

    async create(data: Prisma.TypeRoomCreateInput) {
        const typeRoom = await prisma.typeRoom.create({
            data,
        });

        return typeRoom;
    }

    async delete(id: string): Promise<TypeRoom> {
        const typeRoom = await prisma.typeRoom.delete({
            where: {
                id
            }
        });

        return typeRoom;
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<TypeRoom> {
        const typeRoom = await prisma.typeRoom.update({
            data,
            where: {
                id
            }
        });

        return typeRoom;
    }

    async deleteAll() {
        await prisma.typeRoom.deleteMany();
    }
}
import { prismaTst as prisma } from '@/lib/prisma-tst';
import { Room, Prisma, } from '@prisma/client';
import { RoomRepository } from '../room-repository';

export class PrismaTstRoomRepository implements RoomRepository {

    async findAll(): Promise<Room[] | null> {
        const room = await prisma.room.findMany();

        return room;
    }

    async findById(id: string): Promise<Room | null> {
        const room = await prisma.room.findUnique({
            where: {
                id
            }
        });

        return room;
    }

    async findByTypeRoom(typeRoomId: string): Promise<Room> {
        const room = await prisma.room.findFirst({
            where: {
                typeRoomId: typeRoomId
            }
        });

        return room;
    }

    async create(data: Prisma.RoomCreateInput) {
        const room = await prisma.room.create({
            data
        });

        return room;
    }

    async delete(id: string): Promise<Room> {
        const room = await prisma.room.delete({
            where: {
                id
            }
        });

        return room;
    }

    async update(id: string, data: Prisma.RoomUpdateInput): Promise<Room> {
        const room = await prisma.room.update({
            data,
            where: {
                id
            }
        });

        return room;
    }

    async deleteAll() {
        await prisma.room.deleteMany();
    }
}
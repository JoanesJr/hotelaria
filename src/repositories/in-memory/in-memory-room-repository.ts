
import { Room, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { RoomRepository } from '../room-repository';

export class InMemoryRoomRepository implements RoomRepository {
    public items: Room[] = [];

    async findAll(): Promise<Room[]> {
        return this.items;
    }

    async findById(id: string) {
        const room = this.items.find((item) => item.id === id);

        if (!room) {
            return null;
        }

        return room;
    }

    async create(data: { name: string, info: string, typeRoomId: string, status: string }) {
        const room = {
            id: randomUUID(),
            name: data.name,
            info: data.info,
            status: data.status,
            typeRoomId: data.typeRoomId,
            created_at: new Date(),
        };

        this.items.push(room);

        return room;
    }

    async findByTypeRoom(id: string) {
        const room = this.items.find((item) => item.typeRoomId === id);

        if (!room) {
            return null;
        }

        return room;
    }

    async delete(id: string) {
        const roomes = this.items.filter((item) => item.id != id);
        const room = this.items.filter((item) => item.id == id)[0];

        this.items = roomes;

        return room;
    }

    async update(id: string, data: Prisma.RoomUpdateInput | { name?: string, info?: string, typeRoomId?: string, status?: string }) {

        const typeRoomOld = this.items.filter(user => user.id == id)[0];
        const indexRoom = this.items.indexOf(typeRoomOld);

        const mergeObject = Object.assign(typeRoomOld, data);

        this.items[indexRoom] = mergeObject;

        return mergeObject;

    }
}

import { TypeRoom, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { TypeRoomRepository } from '../typeRoom-repository';

export class InMemoryTypeRoomRepository implements TypeRoomRepository {
    public items: TypeRoom[] = [];

    async findAll(): Promise<TypeRoom[]> {
        return this.items;
    }

    async findById(id: string) {
        const typeRoom = this.items.find((item) => item.id === id);

        if (!typeRoom) {
            return null;
        }

        return typeRoom;
    }

    async findByName(name: string) {
        const typeRoom = this.items.find((item) => item.name === name);

        if (!typeRoom) {
            return null;
        }

        return typeRoom;
    }

    async create(data: Prisma.TypeRoomCreateInput) {
        const typeRoom = {
            id: randomUUID(),
            name: data.name,
            created_at: new Date(),
        };

        this.items.push(typeRoom);

        return typeRoom;
    }

    async delete(id: string) {
        const typeRooms = this.items.filter((item) => item.id != id);
        const typeRoom = this.items.filter((item) => item.id == id)[0];

        this.items = typeRooms;

        return typeRoom;
    }

    async update(id: string, data: Prisma.TypeRoomUpdateInput) {

        const typeRoomOld = this.items.filter(user => user.id == id)[0];
        const indexTypeRoom = this.items.indexOf(typeRoomOld);

        const mergeObject = Object.assign(typeRoomOld, data);

        this.items[indexTypeRoom] = mergeObject;

        return mergeObject;

    }
}
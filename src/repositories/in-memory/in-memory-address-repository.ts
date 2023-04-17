
import { Address, Prisma, User } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { AddressRepository } from '../address-repository';

export class InMemoryAddresssRepository implements AddressRepository {
    public users: User[] = [];
    public items: Address[] = [];

    async findAll(): Promise<Address[]> {
        return this.items;
    }

    async findById(id: string) {
        const address = this.items.find((item) => item.id === id);

        if (!address) {
            return null;
        }

        return address;
    }

    async create(data: { id: string, street: string, neighborhood: string, userId: string, created_at: string | Date, cep: string }) {
        const address = {
            id: randomUUID(),
            street: data.street,
            neighborhood: data.neighborhood,
            cep: data.cep,
            userId: data.userId,
            created_at: new Date(),
        };

        this.items.push(address);

        return address;
    }

    async findByUser(id: string) {
        const address = this.items.find((item) => item.userId === id);

        if (!address) {
            return null;
        }

        return address;
    }

    async delete(id: string) {
        const addresses = this.items.filter((item) => item.id != id);
        const address = this.items.filter((item) => item.id == id)[0];

        this.items = addresses;

        return address;
    }

    async update(id: string, data: Prisma.AddressUpdateInput | { id: string, street: string, neighborhood: string, userId: string, created_at: string | Date, cep: string }) {

        const typeRoomOld = this.items.filter(user => user.id == id)[0];
        const indexAddress = this.items.indexOf(typeRoomOld);

        const mergeObject = Object.assign(typeRoomOld, data);

        this.items[indexAddress] = mergeObject;

        return mergeObject;

    }
}
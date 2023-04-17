import { UsersRepository } from '@/repositories/users-repository';
import { User, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';

export class InMemoryUsersRepository implements UsersRepository {
    public items: User[] = [];

    async findAll(): Promise<User[]> {
        return this.items;
    }

    async findById(id: string) {
        const user = this.items.find((item) => item.id === id);

        if (!user) {
            return null;
        }

        return user;
    }

    async findByEmail(email: string) {
        const user = this.items.find((item) => item.email === email);

        if (!user) {
            return null;
        }

        return user;
    }

    async findByCpf(cpf: string) {
        const user = this.items.find((item) => item.cpf === cpf);

        if (!user) {
            return null;
        }

        return user;
    }

    async create(data: Prisma.UserCreateInput) {
        const user = {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            created_at: new Date(),
            cpf: '151215121',
            birthday: new Date(),
            privilege: 'basic'
        };

        this.items.push(user);

        return user;
    }

    async delete(id: string) {
        const users = this.items.filter((item) => item.id != id);
        const user = this.items.filter((item) => item.id == id)[0];

        this.items = users;

        return user;
    }

    async update(id: string, data: Prisma.UserUpdateInput) {

        const userOld = this.items.filter(user => user.id == id)[0];
        const indexUser = this.items.indexOf(userOld);

        const mergeObject = Object.assign(userOld, data);

        this.items[indexUser] = mergeObject;

        return mergeObject;

    }
}
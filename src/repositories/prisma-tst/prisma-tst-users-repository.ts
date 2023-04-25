import { prismaTst as prisma } from '@/lib/prisma-tst';
import { Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';

export class PrismaTstUsersRepository implements UsersRepository {

    async findAll(): Promise<User[] | null> {
        const user = await prisma.user.findMany();

        return user;
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });

        return user;
    }

    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        return user;
    }

    async findByCpf(cpf: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                cpf
            }
        });

        return user;
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const user = await prisma.user.create({
            data,
        });

        return user;
    }

    async delete(id: string): Promise<User> {
        const user = await prisma.user.delete({
            where: {
                id
            }
        });

        return user;
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        const user = await prisma.user.update({
            data,
            where: {
                id
            }
        });

        return user;
    }

    async deleteAll() {
        await prisma.user.deleteMany();
    }
}
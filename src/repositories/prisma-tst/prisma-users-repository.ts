import { prismaTst as prisma } from '@/lib/prisma-tst';
import { Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';

export class PrismaUsersRepository implements UsersRepository {

    async findAll(): Promise<User[] | null> {
        const user = await prisma.user.findMany({
            include: {
                address: true
            }
        });

        return user;
    }

    async findByUniques(cpf: string, rg: string, email: string): Promise<User | null> {
        const user = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        cpf: cpf
                    },
                    {
                        email: email
                    },
                    {
                        rg: rg
                    }
                ]
            },
            include: {
                address: true
            }
        });

        return user[0] || null;
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                address: true
            }
        });

        return user;
    }

    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include: {
                address: true
            }
        });

        return user;
    }

    async findByCpf(cpf: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                cpf
            },
            include: {
                address: true
            }
        });

        return user;
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const user = await prisma.user.create({
            data,
            include: {
                address: true,
                privilege: true
            }
        });

        return user;
    }

    async delete(id: string): Promise<User> {
        const user = await prisma.user.delete({
            where: {
                id
            },
            include: {
                address: true
            }
        });

        return user;
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        const user = await prisma.user.update({
            data,
            where: {
                id
            },
        });

        return user;
    }
}
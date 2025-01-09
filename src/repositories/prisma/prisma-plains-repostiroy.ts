import { prisma } from '@/lib/prisma';
import { Prisma, Plains } from '@prisma/client';
import { PlainsRepository } from '../plains-repository';

export class PrismaPlainsRepository implements PlainsRepository {
    async findAllActive(): Promise<Plains[] | []> {
        const plains = await prisma.plains.findMany({
            where: { active: true }
        });

        return plains;
    }

    async findAll(): Promise<Plains[] | null> {
        const plains = await prisma.plains.findMany({});

        return plains;
    }

    async findById(id: string): Promise<Plains | null> {
        const plains = await prisma.plains.findUnique({
            where: {
                id
            },
        });

        return plains;
    }

    async findByCpf(cpf: string): Promise<Plains | null> {
        const plains = await prisma.plains.findUnique({
            where: {
                cpf
            },
            include: {
                address: true
            }
        });

        return plains;
    }

    async create(data: Prisma.PlainsCreateInput): Promise<Plains> {
        const plains = await prisma.plains.create({
            data,
        });

        return plains;
    }

    async delete(id: string): Promise<Plains> {
        const plains = await prisma.plains.delete({
            where: {
                id
            },
        });

        return plains;
    }

    async update(id: string, data: Prisma.PlainsUpdateInput): Promise<Plains> {
        const plains = await prisma.plains.update({
            data,
            where: {
                id
            },
        });

        return plains;
    }
}